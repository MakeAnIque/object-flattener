"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortUtil = void 0;
const string_utils_1 = require("./string.utils");
class SortUtil {
    static sortByDotCount(reducedKeys) {
        return reducedKeys.sort((a, b) => string_utils_1.StringUtil.countDots(a) - string_utils_1.StringUtil.countDots(b));
    }
}
exports.SortUtil = SortUtil;
//# sourceMappingURL=sort.utils.js.map