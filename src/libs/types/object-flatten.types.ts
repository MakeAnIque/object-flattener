import { MatchedDepthType } from "../enums";

export type TGenericData = number | string | boolean;

export type TObjectFLattening = { [key: string]: TObject };

export type TNullable = null | undefined;

export type TObject = {
  [key: string]:
    | Record<string, TGenericData | TObjectFLattening | object>
    | TGenericData;
};

export type TObjectFLatten = {
  [key: string]: TGenericData;
};

export type TMatchableObject = {
  type: MatchedDepthType;
  value: TNullable | TGenericData;
};

export type TObjectFlattenedInProgress =
  | "data"
  | "dataSetLength"
  | "dataProcessed"
  | "completed";

export type TObjectFLattenedCompleted =
  | "keysAsColumn"
  | "isError"
  | "dataSetLength"
  | "dataProcessed"
  | "completed";

export type TObjectFLattenedWithError =
  | "isError"
  | "err"
  | "dataProcessed"
  | "dataSetLength";

export type TObjectFLattenSingleObjectCompleted =
  | "keysAsColumn"
  | "isError"
  | "dataSetLength"
  | "dataProcessed"
  | "data"
  | "completed";
