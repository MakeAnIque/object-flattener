import { IObjectFlattenOption } from "./libs/interfaces/flatten.interface";
import { TObject } from "./libs/types/object-flatten.types";
export declare class ObjectFlattener {
    static toDotNotation(data: TObject): Partial<TObject>;
    static toDataTableFromObject(objectSet: TObject, options: IObjectFlattenOption): Pick<import("./libs/interfaces/flatten.interface").IObjectFlattenedDataTableSet, import("./libs/types/object-flatten.types").TObjectFLattenSingleObjectCompleted>;
    static toDataTableFromListAsStream(objectSet: TObject[], options?: IObjectFlattenOption): import("./libs/utils/streaming.utils").DataStreaming;
    static toDataTableFromFile(): void;
}
