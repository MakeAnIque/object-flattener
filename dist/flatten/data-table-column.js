"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTableColumn = void 0;
const object_utils_1 = require("../libs/utils/object.utils");
class DataTableColumn {
    static columnGenerator(columnSet, mappingObject) {
        // Transform to keys from Object of Arrays
        const keysList = mappingObject
            .map((key) => object_utils_1.ObjectUtil.getKeys(key))
            .flat(2);
        keysList.forEach((key) => columnSet.add(key));
    }
}
exports.DataTableColumn = DataTableColumn;
//# sourceMappingURL=data-table-column.js.map