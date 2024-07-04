import { TMatchableObject } from "../types/object-flatten.types";
export declare class StringUtil {
    /**
     * Matches a string against a regular expression pattern or checks if it's a finite number.
     * @param str - The string to match.
     * @param matchable - Optional regular expression pattern (default is /\d+/).
     * @returns TMatchableObject | null - Matched object or null if no match found.
     */
    static matchAndType(str: string, matchable?: RegExp): TMatchableObject | null | undefined;
    /**
     * Sanitizes the depth keys array by removing elements that do not contain '[' and trailing elements without '['.
     * @param depthKeys - The array of depth keys to sanitize.
     * @returns Array<string> - The sanitized array of depth keys.
     */
    static sanitizeLevel(depthKeys: Array<string>, filterTag?: string): Array<string>;
    static countDots(str: string): number;
}
