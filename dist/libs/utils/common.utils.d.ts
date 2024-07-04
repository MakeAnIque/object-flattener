import { TObject } from "../types/object-flatten.types";
export declare class CommonUtil {
    static sanitizeLevel(keyList: string[], filter?: string): Array<string>;
    static reduceSimilarKeys(rawObject: Array<TObject>, filter?: string): string[];
}
