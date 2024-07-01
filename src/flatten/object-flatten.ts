import { DOT_NOTATION_MATCH_KEY } from "../libs/constants/object-flatten.constants";
import { InValidInputJSON } from "../libs/exceptions/exception";
import { TObject } from "../libs/types/object-flatten.types";
import { CommonUtil } from "../libs/utils/common.utils";
import { DotNotation } from "../libs/utils/dot-notation.utils";
import { ObjectUtil } from "../libs/utils/object.utils";

export class ObjectFlatten {
  public static flatten(processingObject: TObject) {
    if (!ObjectUtil.isValid(processingObject)) {
      throw new InValidInputJSON("Input Json Object is not valid");
    }

    return ObjectUtil.sanitizeBuildKeys(
      ObjectFlatten.processFlattenObject(
        ObjectUtil.sanitizeFirstLevelObjectBeforeTraverse(processingObject)
      )
    );
  }

  private static processFlattenObject(
    processingObject: TObject | TObject[]
  ): Array<TObject> {
    const rawDotNotation = DotNotation.parse(processingObject as any);
    const arr = CommonUtil.reduceSimilarKeys(
      rawDotNotation as unknown as Array<TObject>
    );

    if ((processingObject as unknown as TObject[]).length > 1)
      return processingObject as unknown as TObject[];

    if (
      !arr.length ||
      !(arr[arr.length - 1] || "").includes(DOT_NOTATION_MATCH_KEY)
    )
      return processingObject as unknown as TObject[];

    const splittedLevels = CommonUtil.sanitizeLevel(
      (arr.pop() || "").split(".")
    );

    const objectDepthReference = {
      parentRef: ObjectUtil.traverseByLevel(
        processingObject as unknown as TObject,
        splittedLevels.slice(0, splittedLevels.length - 2)
      ),
      nextRef: ObjectUtil.traverseByLevel(
        processingObject as unknown as TObject,
        splittedLevels.slice(0, splittedLevels.length - 1)
      ),
    };

    const parentRefRawKey = splittedLevels.at(splittedLevels.length - 2) || "";
    const childRefRawKey = splittedLevels.at(splittedLevels.length - 1) || "";

    let directParentKeyName = null;
    let directChildKeyName = null;
    if (parentRefRawKey.includes(DOT_NOTATION_MATCH_KEY)) {
      directParentKeyName = (parentRefRawKey || "").split(
        DOT_NOTATION_MATCH_KEY
      )[0];
    } else {
      directParentKeyName = parentRefRawKey;
    }

    if (childRefRawKey.includes(DOT_NOTATION_MATCH_KEY)) {
      directChildKeyName = (childRefRawKey || "").split(
        DOT_NOTATION_MATCH_KEY
      )[0];
    } else {
      directChildKeyName = childRefRawKey;
    }

    if (Array.isArray(objectDepthReference.parentRef[directParentKeyName])) {
      const operationList = objectDepthReference.parentRef[directParentKeyName];
      const childListWithItsRef = [];
      for (const opr of operationList) {
        if (!opr[directChildKeyName]) continue;
        const deRefChildList = JSON.parse(
          JSON.stringify(opr[directChildKeyName] || [])
        );
        delete opr[directChildKeyName];
        for (const childOpr of Array.isArray(deRefChildList)
          ? deRefChildList
          : [deRefChildList]) {
          childListWithItsRef.push({
            ...opr,
            [directChildKeyName]: childOpr,
          });
        }
      }
      objectDepthReference.parentRef[directParentKeyName] = childListWithItsRef;
    } else {
      const operationObj = objectDepthReference.parentRef[directParentKeyName];
      const iterables = JSON.parse(
        JSON.stringify(operationObj[directChildKeyName] || [])
      );
      const childListWithItsRef = [];
      delete operationObj[directChildKeyName];
      for (const opr of iterables) {
        childListWithItsRef.push({
          ...operationObj,
          [directChildKeyName]: opr,
        });
      }
      objectDepthReference.parentRef[directParentKeyName] = childListWithItsRef;
    }

    return ObjectFlatten.processFlattenObject(
      (processingObject as unknown as TObject[]).flat()
    );
  }
}
