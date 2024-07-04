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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectToDataTableTransformer = void 0;
const dot_notation_utils_1 = require("../libs/utils/dot-notation.utils");
const streaming_utils_1 = require("../libs/utils/streaming.utils");
const object_flatten_1 = require("./object-flatten");
const object_utils_1 = require("../libs/utils/object.utils");
const data_table_column_1 = require("./data-table-column");
class ObjectToDataTableTransformer {
    constructor() { }
    static workerProcess(data) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented");
        });
    }
    static dataTableProcessor(dataSet, options) {
        const keys = new Set();
        const dataTableSet = object_flatten_1.ObjectFlatten.flatten(dataSet).map((chunk) => dot_notation_utils_1.DotNotation.parse(chunk));
        if (options.keysAsColumn) {
            data_table_column_1.DataTableColumn.columnGenerator(keys, dataTableSet);
        }
        return {
            keysAsColumn: keys,
            completed: true,
            dataProcessed: 1,
            dataSetLength: 1,
            isError: false,
            data: dataTableSet,
        };
    }
    static fromArray(dataSet, options) {
        // Data Streaming platform with event emitter
        const dataStreaming = new streaming_utils_1.DataStreaming();
        const dataSetLength = dataSet.length;
        const keys = new Set();
        let dataProcessedCount = 0;
        // Self invoke function to make it self async by default to return emitter for large data set of stream junks
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                for (let counter = 0; counter < dataSetLength; counter = counter + options.batchSize) {
                    const chunk = object_utils_1.ObjectUtil.deepCopy(dataSet.slice(counter, counter + options.batchSize));
                    if (!chunk) {
                        return dataStreaming.emit("end", null);
                    }
                    const flattenedChunk = yield Promise.all(chunk.map((chunk) => __awaiter(this, void 0, void 0, function* () {
                        return object_flatten_1.ObjectFlatten.flatten(chunk).map((flattenChunk) => dot_notation_utils_1.DotNotation.parse(flattenChunk));
                    })));
                    dataProcessedCount = dataProcessedCount + flattenedChunk.length;
                    const leanDataTableSet = flattenedChunk.flat(2);
                    // Keys Generator default is false
                    if (options.keysAsColumn) {
                        data_table_column_1.DataTableColumn.columnGenerator(keys, leanDataTableSet);
                    }
                    dataStreaming.emit("data", {
                        data: leanDataTableSet,
                        dataProcessed: dataProcessedCount,
                        dataSetLength: dataSetLength,
                        completed: false,
                        isError: false,
                    });
                }
                // End of Iterations data processed
                dataStreaming.emit("end", {
                    keysAsColumn: keys,
                    completed: true,
                    dataProcessed: dataProcessedCount,
                    dataSetLength: dataSetLength,
                    isError: false,
                });
            }
            catch (err) {
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
    static fromFromLargeSet() { }
}
exports.ObjectToDataTableTransformer = ObjectToDataTableTransformer;
//# sourceMappingURL=data-table.js.map