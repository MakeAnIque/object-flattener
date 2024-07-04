import { TObject } from "../types/object-flatten.types";
export interface IObjectFlattenOption {
    batchSize?: number;
    keysAsColumn?: boolean;
}
export interface IObjectFlattenedDataTableSet {
    data: Array<TObject>;
    keysAsColumn: Set<string>;
    isError: boolean;
    dataSetLength: number;
    dataProcessed: number;
    err: Error;
    completed: boolean;
}
