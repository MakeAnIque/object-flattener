import { TObject, TObjectFLattenSingleObjectCompleted } from "../libs/types/object-flatten.types";
import { DataStreaming } from "../libs/utils/streaming.utils";
import { IObjectFlattenedDataTableSet, IObjectFlattenOption } from "../libs/interfaces/flatten.interface";
export declare class ObjectToDataTableTransformer {
    constructor();
    static workerProcess(data: TObject): Promise<void>;
    static dataTableProcessor(dataSet: TObject, options: Pick<IObjectFlattenOption, "keysAsColumn">): Pick<IObjectFlattenedDataTableSet, TObjectFLattenSingleObjectCompleted>;
    static fromArray(dataSet: TObject[], options: IObjectFlattenOption): DataStreaming;
    static fromFromLargeSet(): void;
}
