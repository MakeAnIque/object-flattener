import { TObject, TObjectFLattenSingleObjectCompleted } from "../libs/types/object-flatten.types";
import { DataStreaming } from "../libs/utils/streaming.utils";
import { IObjectFlattenedDataTableSet, IObjectFlattenOption } from "../libs/interfaces/flatten.interface";
/**
 * Utility class for transforming nested objects or arrays of objects into a flattened data table format.
 * Supports processing single objects, arrays, and large file-based datasets (e.g., JSONL) with streaming for efficiency.
 * Flattens nested structures, applies dot notation to keys, and optionally generates unique column keys.
 * Uses batching for large datasets to manage memory and performance.
 */
export declare class ObjectToDataTableTransformer {
    /**
     * Empty constructor; class is intended for static method usage only.
     */
    constructor();
    /**
     * Placeholder method for potential worker-based processing (e.g., web workers or parallel execution).
     * Currently unimplemented and throws an error.
     * @param data - The object to process.
     * @throws Error - Always throws "Method not implemented".
     */
    static workerProcess(data: TObject): Promise<void>;
    /**
     * Processes a single object into a flattened data table format.
     * Flattens the object, parses with dot notation, and optionally generates column keys.
     * @param dataSet - The single object to process.
     * @param options - Processing options, specifically 'keysAsColumn' to enable column key generation.
     * @returns An object with processed data, completion status, and optional keys.
     */
    static dataTableProcessor(dataSet: TObject, options: Pick<IObjectFlattenOption, "keysAsColumn">): Pick<IObjectFlattenedDataTableSet, TObjectFLattenSingleObjectCompleted>;
    /**
     * Processes an array of objects into flattened data table chunks via streaming.
     * Handles large arrays by batching (using options.batchSize or default), flattening, parsing,
     * and emitting progress via DataStreaming events ('data', 'end', 'error').
     * Optionally collects unique keys across all data.
     * @param dataSet - Array of objects to process.
     * @param options - Flatten options including batchSize and keysAsColumn.
     * @returns DataStreaming instance for listening to processing events.
     */
    static fromArray(dataSet: TObject[], options: IObjectFlattenOption): DataStreaming;
    /**
     * Processes a large dataset from a JSONL file into flattened data table chunks via streaming.
     * Reads file in batches using FileUtil, flattens, parses, and emits progress.
     * Optionally collects unique keys. Note: Method name may be a typo (intended as 'fromLargeSet'?).
     * @param filePath - Path to the JSONL file.
     * @param options - Flatten options including batchSize and keysAsColumn.
     * @returns DataStreaming instance for listening to processing events.
     */
    static fromFromLargeSet(filePath: string, options: IObjectFlattenOption): DataStreaming;
}
