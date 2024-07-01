import {
  DOT_NOTATION_MATCH_KEY,
  LEVEL_MAP_KEY,
} from "../constants/object-flatten.constants";
import { DataType, MatchedDepthType } from "../enums";
import { TObject } from "../types/object-flatten.types";
import { SortUtil } from "./sort.utils";
import { StringUtil } from "./string.utils";

export class ObjectUtil {
  /**
   * Traverse an object by specified depth levels using string-based paths.
   * @param parentObject - The object to traverse.
   * @param depthLevels - Array of strings representing depth levels.
   * @param tag - Separator tag used in array path segments (default is "[").
   * @returns any - The value found at the specified depth levels in the object.
   */
  public static traverseByLevel(
    parentObject: TObject | any,
    depthLevels: Array<string>,
    tag: string = DOT_NOTATION_MATCH_KEY
  ): any {
    for (let depthLevel = 0; depthLevel < depthLevels.length; depthLevel++) {
      const accessorCurrent: any = StringUtil.matchAndType(
        depthLevels[depthLevel] || ""
      );

      if (accessorCurrent.type === MatchedDepthType.OBJECT) {
        parentObject = parentObject[accessorCurrent.value];
      }

      if (accessorCurrent.type === MatchedDepthType.ARRAY) {
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
  static sanitizeFirstLevelObjectBeforeTraverse(
    jsonObject: TObject
  ): Array<{ [LEVEL_MAP_KEY]: TObject }> {
    return [{ [LEVEL_MAP_KEY]: jsonObject }];
  }

  public static isValid(object: TObject): boolean {
    if (object !== null && object !== undefined) return true;
    if (typeof object === DataType.OBJECT) return true;
    return false;
  }

  public static deserializeOperation(
    unWindedJsonData: Array<TObject>
  ): Array<TObject> {
    return unWindedJsonData.map(
      (jsonData) => jsonData[LEVEL_MAP_KEY]
    ) as Array<TObject>;
  }

  public static sanitizeBuildKeys(unWindedJsonData: Array<TObject>) {
    return unWindedJsonData.map((jsonData) => jsonData[LEVEL_MAP_KEY]);
  }

  public static deepCopy(object: TObject | TObject[]) {
    return JSON.parse(JSON.stringify(object));
  }

  public static getKeys(object: TObject): Array<string> {
    return Object.keys(object);
  }
}
