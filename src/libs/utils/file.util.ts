import fs from "fs";
import readline from "readline";
import fetch from "node-fetch";
import { Readable } from "stream";
import { TextDecoder } from "util";

/**
 * Interface for tracking progress state during JSONL processing.
 * Includes counts for processed items and lines, and optional byte offset for resumable URL downloads.
 */
interface ProgressState {
  processedCount: number;
  lineNum: number;
  byteOffset?: number; // For URLs, track byte position
}

/**
 * Utility class for file operations, focused on generating batches from JSONL files or URLs.
 * Supports resumable processing with progress tracking, retries for network failures, and handling both local files and remote URLs.
 * Progress is stored in-memory (could be extended to persistent storage).
 */
export class FileUtil {
  // In-memory progress store (could be persisted to a file/database)
  private static progressStore: Map<string, ProgressState> = new Map();

  /**
   * Async generator that yields batches of JSON objects from a JSONL file (local or URL), with resume on failure.
   * Handles network retries for URLs, skips already processed lines, and tracks progress for resumability.
   * Yields batches along with metadata like iteration count, total lines, and processed count.
   * @param filePathOrUrl - Local file path or HTTP URL to the JSONL file.
   * @param batchSize - Number of items per batch (default: 10).
   * @param maxRetries - Maximum number of retries for network failures (default: 3).
   * @param logging - Enable logging for warnings (default: true, but not actively used in code beyond console.warn).
   * @yields {{ batch: Array<Object>, iteration: number, totalLines: number, processedCount: number }} - Batch of JSON objects, current iteration, total lines, and processed line count.
   * @throws Error - On failure after max retries or unrecoverable errors.
   */
  static async *jsonlBatchGenerator(
    filePathOrUrl: string,
    batchSize = 10,
    maxRetries = 3,
    logging = true
  ) {
    const isUrl =
      filePathOrUrl.startsWith("http://") ||
      filePathOrUrl.startsWith("https://");
    const progressKey = filePathOrUrl;
    let progress = FileUtil.progressStore.get(progressKey) || {
      processedCount: 0,
      lineNum: 0,
      byteOffset: 0,
    };

    // Function to count total lines (local or URL)
    const countTotalLines = async (): Promise<number> => {
      if (isUrl) {
        const response = await fetch(filePathOrUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let lineCount = 0;
        let buffer = "";
        // Use empty stream if response.body is null
        const stream = response.body ?? Readable.from([]);

        return new Promise((resolve, reject) => {
          stream.on("data", (chunk: Buffer) => {
            buffer += chunk.toString();
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            lineCount += lines.length;
          });
          stream.on("end", () => resolve(lineCount));
          stream.on("error", reject);
        });
      } else {
        return new Promise((resolve, reject) => {
          let lineCount = 0;
          const stream = fs.createReadStream(filePathOrUrl);
          const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity,
          });
          rl.on("line", () => lineCount++);
          rl.on("error", reject);
          rl.on("close", () => resolve(lineCount));
        });
      }
    };

    // Get total lines
    let totalLines = await countTotalLines();
    let batch: any[] = [];
    let iteration = Math.floor(progress.processedCount / batchSize) + 1;
    let processedCount = progress.processedCount;
    let lineNum = 0;
    let byteOffset = progress.byteOffset || 0;

    if (isUrl) {
      // Handle URL with retries and resume
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const headers: { [key: string]: string } = {};
          if (byteOffset > 0) {
            headers["Range"] = `bytes=${byteOffset}-`;
          }
          const response = await fetch(filePathOrUrl, { headers });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // Use empty stream if response.body is null
          const stream = response.body ?? Readable.from([]);
          let buffer = "";
          const decoder = new TextDecoder();

          for await (const chunk of stream) {
            // Ensure chunk is a Buffer
            const bufferChunk = Buffer.isBuffer(chunk)
              ? chunk
              : Buffer.from(chunk);
            byteOffset += bufferChunk.length;
            buffer += decoder.decode(bufferChunk, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line

            for (const line of lines) {
              lineNum++;
              if (lineNum <= progress.lineNum) continue; // Skip already processed lines
              try {
                if (line.trim()) {
                  const item = JSON.parse(line);
                  batch.push(item);
                  processedCount++;
                  FileUtil.progressStore.set(progressKey, {
                    processedCount,
                    lineNum,
                    byteOffset,
                  });
                  if (batch.length === batchSize) {
                    yield {
                      batch,
                      iteration: ++iteration,
                      totalLines,
                      processedCount,
                    };
                    batch = [];
                  }
                }
              } catch (err) {
                console.warn(
                  `Warning: Invalid JSON at line ${lineNum}: ${
                    (err as Error).message
                  }`
                );
                continue;
              }
            }
          }
          break; // Success, exit retry loop
        } catch (err) {
          console.warn(`Attempt ${attempt} failed: ${(err as Error).message}`);
          if (attempt === maxRetries) {
            throw new Error(
              `Failed after ${maxRetries} attempts: ${(err as Error).message}`
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    } else {
      // Handle local file
      const fileStream = fs.createReadStream(filePathOrUrl);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        lineNum++;
        if (lineNum <= progress.lineNum) continue; // Skip already processed lines
        try {
          if (line.trim()) {
            const item = JSON.parse(line);
            batch.push(item);
            processedCount++;
            FileUtil.progressStore.set(progressKey, {
              processedCount,
              lineNum,
            });
            if (batch.length === batchSize) {
              yield {
                batch,
                iteration: ++iteration,
                totalLines,
                processedCount,
              };
              batch = [];
            }
          }
        } catch (err) {
          console.warn(
            `Warning: Invalid JSON at line ${lineNum}: ${
              (err as Error).message
            }`
          );
          continue;
        }
      }
    }

    if (batch.length > 0) {
      yield { batch, iteration: ++iteration, totalLines, processedCount }; // Yield any remaining items
      FileUtil.progressStore.set(progressKey, {
        processedCount,
        lineNum,
        byteOffset,
      });
    }
  }

  /**
   * Clears the progress state for a specific file path or URL from the in-memory store.
   * Useful for resetting processing state before re-running the generator.
   * @param filePathOrUrl - The key (file path or URL) for which to clear progress.
   */
  static clearProgress(filePathOrUrl: string) {
    FileUtil.progressStore.delete(filePathOrUrl);
  }
}
