"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectFlattener = void 0;
const data_table_1 = require("./flatten/data-table");
const object_flatten_constants_1 = require("./libs/constants/object-flatten.constants");
const dot_notation_utils_1 = require("./libs/utils/dot-notation.utils");
class ObjectFlattener {
    static toDotNotation(data) {
        return dot_notation_utils_1.DotNotation.parse(data);
    }
    static toDataTableFromObject(objectSet, options) {
        return data_table_1.ObjectToDataTableTransformer.dataTableProcessor(objectSet, options);
    }
    static toDataTableFromListAsStream(objectSet, options = { batchSize: object_flatten_constants_1.BATCH_COUNTER_SIZE }) {
        return data_table_1.ObjectToDataTableTransformer.fromArray(objectSet, options);
    }
    static toDataTableFromFile() {
        throw new Error("Method not implemented");
    }
}
exports.ObjectFlattener = ObjectFlattener;
//# sourceMappingURL=main.js.map