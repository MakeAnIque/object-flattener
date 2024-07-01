import { DOT_NOTATION_MATCH_KEY } from "../constants/object-flatten.constants";
import { TObject } from "../types/object-flatten.types";
import { SortUtil } from "./sort.utils";

export class CommonUtil {
  public static sanitizeLevel(
    keyList: string[],
    filter: string = DOT_NOTATION_MATCH_KEY
  ): Array<string> {
    for (let i = keyList.length - 1; i >= 0; i--) {
      if ((keyList[i] || "").includes(filter)) {
        break;
      } else {
        keyList[i] = "";
      }
    }

    return keyList.filter((key: string) => key);
  }

  public static reduceSimilarKeys(
    rawObject: Array<TObject>,
    filter: string = DOT_NOTATION_MATCH_KEY
  ) {
    const _reducedKeys: string[] = [];
    for (let key in rawObject) {
      if (!_reducedKeys.includes(filter)) _reducedKeys.push(key);
    }

    return SortUtil.sortByDotCount(_reducedKeys);
  }
}
