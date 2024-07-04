"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtil = void 0;
const object_flatten_constants_1 = require("../constants/object-flatten.constants");
const enums_1 = require("../enums");
class StringUtil {
    /**
     * Matches a string against a regular expression pattern or checks if it's a finite number.
     * @param str - The string to match.
     * @param matchable - Optional regular expression pattern (default is /\d+/).
     * @returns TMatchableObject | null - Matched object or null if no match found.
     */
    static matchAndType(str, matchable = /\[(\d+)\]/ // Default matchable pattern for digits
    ) {
        if (!str)
            return null;
        if (Number.isFinite(+str)) {
            return {
                type: enums_1.MatchedDepthType.OBJECT,
                value: +str,
            };
        }
        else if (str.match(/\[(\d+)\]/)) {
            const match = str.match(/\[(\d+)\]/);
            return {
                type: enums_1.MatchedDepthType.ARRAY,
                value: match !== null || match !== undefined ? (match || "")[1] : null,
            };
        }
        else if (!str.match(/\[(\d+)\]/)) {
            return {
                type: enums_1.MatchedDepthType.OBJECT,
                value: str,
            };
        }
    }
    /**
     * Sanitizes the depth keys array by removing elements that do not contain '[' and trailing elements without '['.
     * @param depthKeys - The array of depth keys to sanitize.
     * @returns Array<string> - The sanitized array of depth keys.
     */
    static sanitizeLevel(depthKeys, filterTag = object_flatten_constants_1.DOT_NOTATION_MATCH_KEY) {
        // Iterate through depthKeys in reverse order
        for (let i = depthKeys.length - 1; i >= 0; i--) {
            // Check if current depth key includes '['
            if ((depthKeys[i] || "").includes(filterTag)) {
                // If found, stop further processing
                break;
            }
            else {
                // If not found, set the current depth key to an empty string
                depthKeys[i] = "";
            }
        }
        // Filter out empty strings from depthKeys array
        return depthKeys.filter((depthKey) => depthKey);
    }
    static countDots(str) {
        return (str.match(/\[/g) || []).length;
    }
}
exports.StringUtil = StringUtil;
//# sourceMappingURL=string.utils.js.map