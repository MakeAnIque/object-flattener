import { TObject } from "../types/object-flatten.types";
export declare class DotNotation {
    /**
     * Recursively flattens a nested object using dot notation.
     * @param jsonObject - The object to flatten.
     * @param parentKey - The current parent key in the recursion (default is empty string).
     * @param result - The partial result object where flattened key-value pairs are stored.
     * @returns Partial<TObject> - The flattened partial object.
     */
    static parse(jsonObject: TObject, parentKey?: string, result?: Partial<TObject>): Partial<TObject>;
}
