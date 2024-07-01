import { DOT_NOTATION_MATCH_KEY } from "../constants/object-flatten.constants";
import { MatchedDepthType } from "../enums";
import { TMatchableObject } from "../types/object-flatten.types";

export class StringUtil {
  /**
   * Matches a string against a regular expression pattern or checks if it's a finite number.
   * @param str - The string to match.
   * @param matchable - Optional regular expression pattern (default is /\d+/).
   * @returns TMatchableObject | null - Matched object or null if no match found.
   */
  public static matchAndType(
    str: string,
    matchable: RegExp = /\[(\d+)\]/ // Default matchable pattern for digits
  ): TMatchableObject | null | undefined {
    if (!str) return null;
    if (Number.isFinite(+str)) {
      return {
        type: MatchedDepthType.OBJECT,
        value: +str,
      };
    } else if (str.match(/\[(\d+)\]/)) {
      const match = str.match(/\[(\d+)\]/);
      return {
        type: MatchedDepthType.ARRAY,
        value: match !== null || match !== undefined ? (match || "")[1] : null,
      };
    } else if (!str.match(/\[(\d+)\]/)) {
      return {
        type: MatchedDepthType.OBJECT,
        value: str,
      };
    }
  }

  /**
   * Sanitizes the depth keys array by removing elements that do not contain '[' and trailing elements without '['.
   * @param depthKeys - The array of depth keys to sanitize.
   * @returns Array<string> - The sanitized array of depth keys.
   */
  public static sanitizeLevel(
    depthKeys: Array<string>,
    filterTag: string = DOT_NOTATION_MATCH_KEY
  ): Array<string> {
    // Iterate through depthKeys in reverse order
    for (let i = depthKeys.length - 1; i >= 0; i--) {
      // Check if current depth key includes '['
      if ((depthKeys[i] || "").includes(filterTag)) {
        // If found, stop further processing
        break;
      } else {
        // If not found, set the current depth key to an empty string
        depthKeys[i] = "";
      }
    }

    // Filter out empty strings from depthKeys array
    return depthKeys.filter((depthKey) => depthKey);
  }

  static countDots(str: string) {
    return (str.match(/\[/g) || []).length;
  }
}
