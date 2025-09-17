"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectToDataTableTransformer = void 0;
const dot_notation_utils_1 = require("../libs/utils/dot-notation.utils");
const streaming_utils_1 = require("../libs/utils/streaming.utils");
const object_flatten_1 = require("./object-flatten");
const object_utils_1 = require("../libs/utils/object.utils");
const data_table_column_1 = require("./data-table-column");
const file_util_1 = require("../libs/utils/file.util");
/**
 * Utility class for transforming nested objects or arrays of objects into a flattened data table format.
 * Supports processing single objects, arrays, and large file-based datasets (e.g., JSONL) with streaming for efficiency.
 * Flattens nested structures, applies dot notation to keys, and optionally generates unique column keys.
 * Uses batching for large datasets to manage memory and performance.
 */
class ObjectToDataTableTransformer {
    /**
     * Empty constructor; class is intended for static method usage only.
     */
    constructor() { }
    /**
     * Placeholder method for potential worker-based processing (e.g., web workers or parallel execution).
     * Currently unimplemented and throws an error.
     * @param data - The object to process.
     * @throws Error - Always throws "Method not implemented".
     */
    static workerProcess(data) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented");
        });
    }
    /**
     * Processes a single object into a flattened data table format.
     * Flattens the object, parses with dot notation, and optionally generates column keys.
     * @param dataSet - The single object to process.
     * @param options - Processing options, specifically 'keysAsColumn' to enable column key generation.
     * @returns An object with processed data, completion status, and optional keys.
     */
    static dataTableProcessor(dataSet, options) {
        // Set to collect unique keys if column generation is enabled
        const keys = new Set();
        // Flatten the object and parse each chunk with dot notation
        const dataTableSet = object_flatten_1.ObjectFlatten.flatten(dataSet).map((chunk) => dot_notation_utils_1.DotNotation.parse(chunk));
        // Generate columns if option is enabled
        if (options.keysAsColumn) {
            data_table_column_1.DataTableColumn.columnGenerator(keys, dataTableSet);
        }
        // Return structured result indicating single object completion
        return {
            keysAsColumn: keys,
            completed: true,
            dataProcessed: 1,
            dataSetLength: 1,
            isError: false,
            data: dataTableSet,
        };
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
    static fromArray(dataSet, options) {
        // Event emitter for streaming data chunks and status
        const dataStreaming = new streaming_utils_1.DataStreaming();
        const dataSetLength = dataSet.length;
        const keys = new Set();
        let dataProcessedCount = 0;
        // Async IIFE to process batches without blocking
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                // Loop through array in batches
                for (let counter = 0; counter < dataSetLength; counter = counter + options.batchSize) {
                    // Deep copy batch to avoid mutating original data
                    const chunk = object_utils_1.ObjectUtil.deepCopy(dataSet.slice(counter, counter + options.batchSize));
                    if (!chunk) {
                        return dataStreaming.emit("end", null);
                    }
                    // Flatten and parse each item in batch concurrently
                    const flattenedChunk = yield Promise.all(chunk.map((chunk) => __awaiter(this, void 0, void 0, function* () {
                        return object_flatten_1.ObjectFlatten.flatten(chunk).map((flattenChunk) => dot_notation_utils_1.DotNotation.parse(flattenChunk));
                    })));
                    // Update processed count
                    dataProcessedCount = dataProcessedCount + flattenedChunk.length;
                    // Flatten nested arrays for emission
                    const leanDataTableSet = flattenedChunk.flat(2);
                    // Generate columns if enabled
                    if (options.keysAsColumn) {
                        data_table_column_1.DataTableColumn.columnGenerator(keys, leanDataTableSet);
                    }
                    // Emit in-progress data chunk
                    dataStreaming.emit("data", {
                        data: leanDataTableSet,
                        dataProcessed: dataProcessedCount,
                        dataSetLength: dataSetLength,
                        completed: false,
                        isError: false,
                    });
                }
                // Emit completion event with final keys and status
                dataStreaming.emit("end", {
                    keysAsColumn: keys,
                    completed: true,
                    dataProcessed: dataProcessedCount,
                    dataSetLength: dataSetLength,
                    isError: false,
                });
            }
            catch (err) {
                // Emit error event on failure
                dataStreaming.emit("error", {
                    isError: true,
                    err,
                    dataProcessed: dataProcessedCount,
                    dataSetLength: dataSetLength,
                });
            }
        }))();
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
    static fromFromLargeSet(filePath, options) {
        // Event emitter for streaming
        const dataStreaming = new streaming_utils_1.DataStreaming();
        const keys = new Set();
        // Async IIFE for file processing
        (() => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                try {
                    // Iterate over batches from file generator
                    for (var _d = true, _e = __asyncValues(file_util_1.FileUtil.jsonlBatchGenerator(filePath, options.batchSize)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const { batch, totalLines, processedCount, } = _c;
                        // Flatten and parse batch concurrently, then flat(1) to merge
                        const flattenedChunk = (yield Promise.all(batch.map((chunk) => __awaiter(this, void 0, void 0, function* () {
                            return object_flatten_1.ObjectFlatten.flatten(chunk).map((flattenChunk) => dot_notation_utils_1.DotNotation.parse(flattenChunk));
                        })))).flat(1);
                        // Generate columns if enabled
                        if (options.keysAsColumn) {
                            data_table_column_1.DataTableColumn.columnGenerator(keys, flattenedChunk);
                        }
                        // Emit in-progress data
                        dataStreaming.emit("data", {
                            keysAsColumn: keys,
                            data: flattenedChunk,
                            dataProcessed: processedCount,
                            dataSetLength: totalLines,
                            completed: false,
                            isError: false,
                        });
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (err) {
                // Emit error on failure (note: processed counts reset to 0)
                dataStreaming.emit("error", {
                    isError: true,
                    err,
                    dataProcessed: 0,
                    dataSetLength: 0,
                });
            }
            // Emit final completion event (with empty data for consistency)
            dataStreaming.emit("data", {
                data: [],
                keysAsColumn: keys,
                dataProcessed: 0,
                dataSetLength: 0,
                completed: true,
                isError: false,
            });
        }))();
        return dataStreaming;
    }
}
exports.ObjectToDataTableTransformer = ObjectToDataTableTransformer;
//# sourceMappingURL=data-table.js.map