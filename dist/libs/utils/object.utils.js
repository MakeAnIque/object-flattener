"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtil = void 0;
const object_flatten_constants_1 = require("../constants/object-flatten.constants");
const enums_1 = require("../enums");
const string_utils_1 = require("./string.utils");
class ObjectUtil {
    /**
     * Traverse an object by specified depth levels using string-based paths.
     * @param parentObject - The object to traverse.
     * @param depthLevels - Array of strings representing depth levels.
     * @param tag - Separator tag used in array path segments (default is "[").
     * @returns any - The value found at the specified depth levels in the object.
     */
    static traverseByLevel(parentObject, depthLevels, tag = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY) {
        for (let depthLevel = 0; depthLevel < depthLevels.length; depthLevel++) {
            const accessorCurrent = string_utils_1.StringUtil.matchAndType(depthLevels[depthLevel] || "");
            if (accessorCurrent.type === enums_1.MatchedDepthType.OBJECT) {
                parentObject = parentObject[accessorCurrent.value];
            }
            if (accessorCurrent.type === enums_1.MatchedDepthType.ARRAY) {
                const directKeyName = (depthLevels[depthLevel] || "").split(tag)[0];
                parentObject = parentObject[directKeyName][accessorCurrent.value];
            }
        }
        return parentObject;
    }
    /**
     * Sanitizes the first-level object before traversal by wrapping it in an array with a level map key.
     * @param jsonObject - The object to sanitize.
     * @returns Array<{ [LEVEL_MAP_KEY]: TObject }> - An array containing the sanitized object with a level map key.
     */
    static sanitizeFirstLevelObjectBeforeTraverse(jsonObject) {
        return [{ [object_flatten_constants_1.LEVEL_MAP_KEY]: jsonObject }];
    }
    static isValid(object) {
        if (object !== null && object !== undefined)
            return true;
        if (typeof object === enums_1.DataType.OBJECT)
            return true;
        return false;
    }
    static deserializeOperation(unWindedJsonData) {
        return unWindedJsonData.map((jsonData) => jsonData[object_flatten_constants_1.LEVEL_MAP_KEY]);
    }
    static sanitizeBuildKeys(unWindedJsonData) {
        return unWindedJsonData.map((jsonData) => jsonData[object_flatten_constants_1.LEVEL_MAP_KEY]);
    }
    static deepCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }
    static getKeys(object) {
        return Object.keys(object);
    }
}
exports.ObjectUtil = ObjectUtil;
//# sourceMappingURL=object.utils.js.map