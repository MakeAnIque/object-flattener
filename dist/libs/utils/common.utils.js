"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUtil = void 0;
const object_flatten_constants_1 = require("../constants/object-flatten.constants");
const sort_utils_1 = require("./sort.utils");
class CommonUtil {
    static sanitizeLevel(keyList, filter = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY) {
        for (let i = keyList.length - 1; i >= 0; i--) {
            if ((keyList[i] || "").includes(filter)) {
                break;
            }
            else {
                keyList[i] = "";
            }
        }
        return keyList.filter((key) => key);
    }
    static reduceSimilarKeys(rawObject, filter = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY) {
        const _reducedKeys = [];
        for (let key in rawObject) {
            if (!_reducedKeys.includes(filter))
                _reducedKeys.push(key);
        }
        return sort_utils_1.SortUtil.sortByDotCount(_reducedKeys);
    }
}
exports.CommonUtil = CommonUtil;
//# sourceMappingURL=common.utils.js.map