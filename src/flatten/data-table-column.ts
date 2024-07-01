import { TObject } from "../libs/types/object-flatten.types";
import { ObjectUtil } from "../libs/utils/object.utils";

export class DataTableColumn {
  public static columnGenerator(
    columnSet: Set<string>,
    mappingObject: TObject[]
  ) {
    // Transform to keys from Object of Arrays
    const keysList = mappingObject
      .map((key) => ObjectUtil.getKeys(key))
      .flat(2);

    keysList.forEach((key) => columnSet.add(key));
  }
}
