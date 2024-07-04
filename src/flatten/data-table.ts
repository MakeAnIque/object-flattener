import { BATCH_COUNTER_SIZE } from "../libs/constants/object-flatten.constants";
import {
  TObject,
  TObjectFLattenedCompleted,
  TObjectFlattenedInProgress,
  TObjectFLattenedWithError,
  TObjectFLattenSingleObjectCompleted,
} from "../libs/types/object-flatten.types";
import { DotNotation } from "../libs/utils/dot-notation.utils";
import { DataStreaming } from "../libs/utils/streaming.utils";
import { ObjectFlatten } from "./object-flatten";
import { ObjectUtil } from "../libs/utils/object.utils";
import {
  IObjectFlattenedDataTableSet,
  IObjectFlattenOption,
} from "../libs/interfaces/flatten.interface";
import { DataTableColumn } from "./data-table-column";

export class ObjectToDataTableTransformer {
  constructor() {}

  public static async workerProcess(data: TObject) {
    throw new Error("Method not implemented");
  }

  public static dataTableProcessor(
    dataSet: TObject,
    options: Pick<IObjectFlattenOption, "keysAsColumn">
  ) {
    const keys = new Set<string>();
    const dataTableSet = ObjectFlatten.flatten(dataSet).map((chunk) =>
      DotNotation.parse(chunk as TObject)
    );
    if (options.keysAsColumn) {
      DataTableColumn.columnGenerator(keys, dataTableSet as TObject[]);
    }
    return {
      keysAsColumn: keys,
      completed: true,
      dataProcessed: 1,
      dataSetLength: 1,
      isError: false,
      data: dataTableSet,
    } as Pick<
      IObjectFlattenedDataTableSet,
      TObjectFLattenSingleObjectCompleted
    >;
  }

  public static fromArray(dataSet: TObject[], options: IObjectFlattenOption) {
    // Data Streaming platform with event emitter
    const dataStreaming = new DataStreaming();
    const dataSetLength = dataSet.length;
    const keys: Set<string> = new Set<string>();
    let dataProcessedCount = 0;
    // Self invoke function to make it self async by default to return emitter for large data set of stream junks
    (async () => {
      try {
        for (
          let counter = 0;
          counter < dataSetLength;
          counter = counter + (options.batchSize as number)
        ) {
          const chunk = ObjectUtil.deepCopy(
            dataSet.slice(counter, counter + (options.batchSize as number))
          ) as TObject[];
          if (!chunk) {
            return dataStreaming.emit("end", null);
          }
          const flattenedChunk = await Promise.all(
            chunk.map(async (chunk) =>
              ObjectFlatten.flatten(chunk).map((flattenChunk) =>
                DotNotation.parse(flattenChunk as TObject)
              )
            )
          );
          dataProcessedCount = dataProcessedCount + flattenedChunk.length;
          const leanDataTableSet = flattenedChunk.flat(2);
          // Keys Generator default is false
          if (options.keysAsColumn) {
            DataTableColumn.columnGenerator(
              keys,
              leanDataTableSet as TObject[]
            );
          }
          dataStreaming.emit("data", {
            data: leanDataTableSet,
            dataProcessed: dataProcessedCount,
            dataSetLength: dataSetLength,
            completed: false,
            isError: false,
          } as Pick<IObjectFlattenedDataTableSet, TObjectFlattenedInProgress>);
        }
        // End of Iterations data processed
        dataStreaming.emit("end", {
          keysAsColumn: keys,
          completed: true,
          dataProcessed: dataProcessedCount,
          dataSetLength: dataSetLength,
          isError: false,
        } as Pick<IObjectFlattenedDataTableSet, TObjectFLattenedCompleted>);
      } catch (err) {
        dataStreaming.emit("error", {
          isError: true,
          err,
          dataProcessed: dataProcessedCount,
          dataSetLength: dataSetLength,
        } as Pick<IObjectFlattenedDataTableSet, TObjectFLattenedWithError>);
      }
    })();

    return dataStreaming;
  }
  public static fromFromLargeSet() {}
}
