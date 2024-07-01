import { StringUtil } from "./string.utils";

export class SortUtil {
  static sortByDotCount(reducedKeys: string[]) {
    return reducedKeys.sort(
      (a, b) => StringUtil.countDots(a) - StringUtil.countDots(b)
    );
  }
}
