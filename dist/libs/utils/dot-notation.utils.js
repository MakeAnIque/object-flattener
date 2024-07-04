"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotNotation = void 0;
const enums_1 = require("../enums"); // Assuming DataType enum is imported from enums file
class DotNotation {
    /**
     * Recursively flattens a nested object using dot notation.
     * @param jsonObject - The object to flatten.
     * @param parentKey - The current parent key in the recursion (default is empty string).
     * @param result - The partial result object where flattened key-value pairs are stored.
     * @returns Partial<TObject> - The flattened partial object.
     */
    static parse(jsonObject, parentKey = "", result = {}) {
        for (let key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                const newKey = parentKey ? `${parentKey}.${key}` : key;
                if (Array.isArray(jsonObject[key])) {
                    jsonObject[key].forEach((item, index) => {
                        DotNotation.parse(item, `${newKey}[${index}]`, result);
                    });
                }
                else if (typeof jsonObject[key] === enums_1.DataType.OBJECT &&
                    jsonObject[key] !== null) {
                    DotNotation.parse(jsonObject[key], newKey, result);
                }
                else {
                    result[newKey] = jsonObject[key];
                }
            }
        }
        return result;
    }
}
exports.DotNotation = DotNotation;
//# sourceMappingURL=dot-notation.utils.js.map