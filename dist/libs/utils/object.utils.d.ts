import { LEVEL_MAP_KEY } from "../constants/object-flatten.constants";
import { TObject } from "../types/object-flatten.types";
export declare class ObjectUtil {
    /**
     * Traverse an object by specified depth levels using string-based paths.
     * @param parentObject - The object to traverse.
     * @param depthLevels - Array of strings representing depth levels.
     * @param tag - Separator tag used in array path segments (default is "[").
     * @returns any - The value found at the specified depth levels in the object.
     */
    static traverseByLevel(parentObject: TObject | any, depthLevels: Array<string>, tag?: string): any;
    /**
     * Sanitizes the first-level object before traversal by wrapping it in an array with a level map key.
     * @param jsonObject - The object to sanitize.
     * @returns Array<{ [LEVEL_MAP_KEY]: TObject }> - An array containing the sanitized object with a level map key.
     */
    static sanitizeFirstLevelObjectBeforeTraverse(jsonObject: TObject): Array<{
        [LEVEL_MAP_KEY]: TObject;
    }>;
    static isValid(object: TObject): boolean;
    static deserializeOperation(unWindedJsonData: Array<TObject>): Array<TObject>;
    static sanitizeBuildKeys(unWindedJsonData: Array<TObject>): (import("../types/object-flatten.types").TGenericData | Record<string, object | import("../types/object-flatten.types").TGenericData | import("../types/object-flatten.types").TObjectFLattening>)[];
    static deepCopy(object: TObject | TObject[]): any;
    static getKeys(object: TObject): Array<string>;
}
