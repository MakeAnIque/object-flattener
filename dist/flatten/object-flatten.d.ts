import { TObject } from "../libs/types/object-flatten.types";
export declare class ObjectFlatten {
    static flatten(processingObject: TObject): (import("../libs/types/object-flatten.types").TGenericData | Record<string, object | import("../libs/types/object-flatten.types").TGenericData | import("../libs/types/object-flatten.types").TObjectFLattening>)[];
    private static processFlattenObject;
}
