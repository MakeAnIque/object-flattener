/**
 * Utility class for file operations, focused on generating batches from JSONL files or URLs.
 * Supports resumable processing with progress tracking, retries for network failures, and handling both local files and remote URLs.
 * Progress is stored in-memory (could be extended to persistent storage).
 */
export declare class FileUtil {
    private static progressStore;
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
    static jsonlBatchGenerator(filePathOrUrl: string, batchSize?: number, maxRetries?: number, logging?: boolean): AsyncGenerator<{
        batch: any[];
        iteration: number;
        totalLines: number;
        processedCount: number;
    }, void, unknown>;
    /**
     * Clears the progress state for a specific file path or URL from the in-memory store.
     * Useful for resetting processing state before re-running the generator.
     * @param filePathOrUrl - The key (file path or URL) for which to clear progress.
     */
    static clearProgress(filePathOrUrl: string): void;
}
