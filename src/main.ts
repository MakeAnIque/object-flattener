import { ObjectToDataTableTransformer } from "./flatten/data-table";
import { BATCH_COUNTER_SIZE } from "./libs/constants/object-flatten.constants";
import { IObjectFlattenOption } from "./libs/interfaces/flatten.interface";
import { TObject } from "./libs/types/object-flatten.types";
import { DotNotation } from "./libs/utils/dot-notation.utils";

export class ObjectFlattener {
  public static toDotNotation(data: TObject) {
    return DotNotation.parse(data);
  }

  public static toDataTableFromObject(
    objectSet: TObject,
    options: IObjectFlattenOption
  ) {
    return ObjectToDataTableTransformer.dataTableProcessor(objectSet, options);
  }

  public static toDataTableFromListAsStream(
    objectSet: TObject[],
    options: IObjectFlattenOption = { batchSize: BATCH_COUNTER_SIZE }
  ) {
    return ObjectToDataTableTransformer.fromArray(objectSet, options);
  }

  public static toDataTableFromFile() {
    throw new Error("Method not implemented");
  }
}
