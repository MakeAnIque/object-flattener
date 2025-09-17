import {
  TObject,
  TObjectFLattenedCompleted,
  TObjectFlattenedInProgress,
  TObjectFLattenedWithError,
  TObjectFLattenSingleObjectCompleted,
} from "../libs/types/object-flatten.types";
import { DotNotation } from "../libs/utils/dot-notation.utils";
import { DataStreaming } from "../libs/utils/streaming.utils";
import { ObjectFlatten } from "./object-flatten";
import { ObjectUtil } from "../libs/utils/object.utils";
import {
  IObjectFlattenedDataTableSet,
  IObjectFlattenOption,
} from "../libs/interfaces/flatten.interface";
import { DataTableColumn } from "./data-table-column";
import { FileUtil } from "../libs/utils/file.util";

/**
 * Utility class for transforming nested objects or arrays of objects into a flattened data table format.
 * Supports processing single objects, arrays, and large file-based datasets (e.g., JSONL) with streaming for efficiency.
 * Flattens nested structures, applies dot notation to keys, and optionally generates unique column keys.
 * Uses batching for large datasets to manage memory and performance.
 */
export class ObjectToDataTableTransformer {
  /**
   * Empty constructor; class is intended for static method usage only.
   */
  constructor() {}

  /**
   * Placeholder method for potential worker-based processing (e.g., web workers or parallel execution).
   * Currently unimplemented and throws an error.
   * @param data - The object to process.
   * @throws Error - Always throws "Method not implemented".
   */
  public static async workerProcess(data: TObject) {
    throw new Error("Method not implemented");
  }

  /**
   * Processes a single object into a flattened data table format.
   * Flattens the object, parses with dot notation, and optionally generates column keys.
   * @param dataSet - The single object to process.
   * @param options - Processing options, specifically 'keysAsColumn' to enable column key generation.
   * @returns An object with processed data, completion status, and optional keys.
   */
  public static dataTableProcessor(
    dataSet: TObject,
    options: Pick<IObjectFlattenOption, "keysAsColumn">
  ) {
    // Set to collect unique keys if column generation is enabled
    const keys = new Set<string>();
    // Flatten the object and parse each chunk with dot notation
    const dataTableSet = ObjectFlatten.flatten(dataSet).map((chunk) =>
      DotNotation.parse(chunk as TObject)
    );
    // Generate columns if option is enabled
    if (options.keysAsColumn) {
      DataTableColumn.columnGenerator(keys, dataTableSet as TObject[]);
    }
    // Return structured result indicating single object completion
    return {
      keysAsColumn: keys,
      completed: true,
      dataProcessed: 1,
      dataSetLength: 1,
      isError: false,
      data: dataTableSet,
    } as Pick<
      IObjectFlattenedDataTableSet,
      TObjectFLattenSingleObjectCompleted
    >;
  }

  /**
   * Processes an array of objects into flattened data table chunks via streaming.
   * Handles large arrays by batching (using options.batchSize or default), flattening, parsing,
   * and emitting progress via DataStreaming events ('data', 'end', 'error').
   * Optionally collects unique keys across all data.
   * @param dataSet - Array of objects to process.
   * @param options - Flatten options including batchSize and keysAsColumn.
   * @returns DataStreaming instance for listening to processing events.
   */
  public static fromArray(dataSet: TObject[], options: IObjectFlattenOption) {
    // Event emitter for streaming data chunks and status
    const dataStreaming = new DataStreaming();
    const dataSetLength = dataSet.length;
    const keys: Set<string> = new Set<string>();
    let dataProcessedCount = 0;
    // Async IIFE to process batches without blocking
    (async () => {
      try {
        // Loop through array in batches
        for (
          let counter = 0;
          counter < dataSetLength;
          counter = counter + (options.batchSize as number)
        ) {
          // Deep copy batch to avoid mutating original data
          const chunk = ObjectUtil.deepCopy(
            dataSet.slice(counter, counter + (options.batchSize as number))
          ) as TObject[];
          if (!chunk) {
            return dataStreaming.emit("end", null);
          }
          // Flatten and parse each item in batch concurrently
          const flattenedChunk = await Promise.all(
            chunk.map(async (chunk) =>
              ObjectFlatten.flatten(chunk).map((flattenChunk) =>
                DotNotation.parse(flattenChunk as TObject)
              )
            )
          );
          // Update processed count
          dataProcessedCount = dataProcessedCount + flattenedChunk.length;
          // Flatten nested arrays for emission
          const leanDataTableSet = flattenedChunk.flat(2);
          // Generate columns if enabled
          if (options.keysAsColumn) {
            DataTableColumn.columnGenerator(
              keys,
              leanDataTableSet as TObject[]
            );
          }
          // Emit in-progress data chunk
          dataStreaming.emit("data", {
            data: leanDataTableSet,
            dataProcessed: dataProcessedCount,
            dataSetLength: dataSetLength,
            completed: false,
            isError: false,
          } as Pick<IObjectFlattenedDataTableSet, TObjectFlattenedInProgress>);
        }
        // Emit completion event with final keys and status
        dataStreaming.emit("end", {
          keysAsColumn: keys,
          completed: true,
          dataProcessed: dataProcessedCount,
          dataSetLength: dataSetLength,
          isError: false,
        } as Pick<IObjectFlattenedDataTableSet, TObjectFLattenedCompleted>);
      } catch (err) {
        // Emit error event on failure
        dataStreaming.emit("error", {
          isError: true,
          err,
          dataProcessed: dataProcessedCount,
          dataSetLength: dataSetLength,
        } as Pick<IObjectFlattenedDataTableSet, TObjectFLattenedWithError>);
      }
    })();

    return dataStreaming;
  }

  /**
   * Processes a large dataset from a JSONL file into flattened data table chunks via streaming.
   * Reads file in batches using FileUtil, flattens, parses, and emits progress.
   * Optionally collects unique keys. Note: Method name may be a typo (intended as 'fromLargeSet'?).
   * @param filePath - Path to the JSONL file.
   * @param options - Flatten options including batchSize and keysAsColumn.
   * @returns DataStreaming instance for listening to processing events.
   */
  public static fromFromLargeSet(
    filePath: string,
    options: IObjectFlattenOption
  ) {
    // Event emitter for streaming
    const dataStreaming = new DataStreaming();
    const keys: Set<string> = new Set<string>();
    // Async IIFE for file processing
    (async () => {
      try {
        // Iterate over batches from file generator
        for await (const {
          batch,
          totalLines,
          processedCount,
        } of FileUtil.jsonlBatchGenerator(filePath, options.batchSize)) {
          // Flatten and parse batch concurrently, then flat(1) to merge
          const flattenedChunk = (
            await Promise.all(
              batch.map(async (chunk) =>
                ObjectFlatten.flatten(chunk).map((flattenChunk) =>
                  DotNotation.parse(flattenChunk as TObject)
                )
              )
            )
          ).flat(1);
          // Generate columns if enabled
          if (options.keysAsColumn) {
            DataTableColumn.columnGenerator(keys, flattenedChunk as TObject[]);
          }
          // Emit in-progress data
          dataStreaming.emit("data", {
            keysAsColumn: keys,
            data: flattenedChunk,
            dataProcessed: processedCount,
            dataSetLength: totalLines,
            completed: false,
            isError: false,
          } as Pick<IObjectFlattenedDataTableSet, TObjectFlattenedInProgress>);
        }
      } catch (err) {
        // Emit error on failure (note: processed counts reset to 0)
        dataStreaming.emit("error", {
          isError: true,
          err,
          dataProcessed: 0,
          dataSetLength: 0,
        } as Pick<IObjectFlattenedDataTableSet, TObjectFLattenedWithError>);
      }
      // Emit final completion event (with empty data for consistency)
      dataStreaming.emit("data", {
        data: [],
        keysAsColumn: keys,
        dataProcessed: 0,
        dataSetLength: 0,
        completed: true,
        isError: false,
      } as Pick<IObjectFlattenedDataTableSet, TObjectFlattenedInProgress>);
    })();
    return dataStreaming;
  }
}
