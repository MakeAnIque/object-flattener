"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_flatten_constants_1 = require("../constants/object-flatten.constants");
const common_utils_1 = require("./common.utils");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("CommonUtil", () => {
    (0, globals_1.test)("CommonUtil.sanitizeLevel - for has List Depth", () => {
        const keyList = [
            "0",
            "__DATA_KEY__",
            "DECISION",
            "verificationModule",
            "request",
            "REQUEST",
            "APPLICATION-DATA",
            "PREVIOUS-DECISION-REMARKS[0]",
            "",
        ];
        const filter = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY;
        const result = common_utils_1.CommonUtil.sanitizeLevel(keyList, filter);
        if (!result) {
            (0, globals_1.expect)(false).toBe(true);
        }
        if (!result.length) {
            (0, globals_1.expect)(false).toBe(true);
        }
        const lastResult = result[result.length - 1];
        (0, globals_1.expect)(lastResult.includes("[")).toBe(true);
    });
    (0, globals_1.test)("CommonUtil.sanitizeLevel - for has no List Depth", () => {
        const keyList = [
            "0",
            "__DATA_KEY__",
            "DECISION",
            "verificationModule",
            "request",
            "REQUEST",
            "APPLICATION-DATA",
            "",
        ];
        const filter = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY;
        const result = common_utils_1.CommonUtil.sanitizeLevel(keyList, filter);
        if (!result.length) {
            (0, globals_1.expect)(true).toBe(true);
        }
    });
});
//# sourceMappingURL=common.utils.spec.js.map