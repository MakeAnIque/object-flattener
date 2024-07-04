"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectFlatten = void 0;
const object_flatten_constants_1 = require("../libs/constants/object-flatten.constants");
const exception_1 = require("../libs/exceptions/exception");
const common_utils_1 = require("../libs/utils/common.utils");
const dot_notation_utils_1 = require("../libs/utils/dot-notation.utils");
const object_utils_1 = require("../libs/utils/object.utils");
class ObjectFlatten {
    static flatten(processingObject) {
        if (!object_utils_1.ObjectUtil.isValid(processingObject)) {
            throw new exception_1.InValidInputJSON("Input Json Object is not valid");
        }
        return object_utils_1.ObjectUtil.sanitizeBuildKeys(ObjectFlatten.processFlattenObject(object_utils_1.ObjectUtil.sanitizeFirstLevelObjectBeforeTraverse(processingObject)));
    }
    static processFlattenObject(processingObject) {
        const rawDotNotation = dot_notation_utils_1.DotNotation.parse(processingObject);
        const arr = common_utils_1.CommonUtil.reduceSimilarKeys(rawDotNotation);
        if (processingObject.length > 1)
            return processingObject;
        if (!arr.length ||
            !(arr[arr.length - 1] || "").includes(object_flatten_constants_1.DOT_NOTATION_MATCH_KEY))
            return processingObject;
        const splittedLevels = common_utils_1.CommonUtil.sanitizeLevel((arr.pop() || "").split("."));
        const objectDepthReference = {
            parentRef: object_utils_1.ObjectUtil.traverseByLevel(processingObject, splittedLevels.slice(0, splittedLevels.length - 2)),
            nextRef: object_utils_1.ObjectUtil.traverseByLevel(processingObject, splittedLevels.slice(0, splittedLevels.length - 1)),
        };
        const parentRefRawKey = splittedLevels.at(splittedLevels.length - 2) || "";
        const childRefRawKey = splittedLevels.at(splittedLevels.length - 1) || "";
        let directParentKeyName = null;
        let directChildKeyName = null;
        if (parentRefRawKey.includes(object_flatten_constants_1.DOT_NOTATION_MATCH_KEY)) {
            directParentKeyName = (parentRefRawKey || "").split(object_flatten_constants_1.DOT_NOTATION_MATCH_KEY)[0];
        }
        else {
            directParentKeyName = parentRefRawKey;
        }
        if (childRefRawKey.includes(object_flatten_constants_1.DOT_NOTATION_MATCH_KEY)) {
            directChildKeyName = (childRefRawKey || "").split(object_flatten_constants_1.DOT_NOTATION_MATCH_KEY)[0];
        }
        else {
            directChildKeyName = childRefRawKey;
        }
        if (Array.isArray(objectDepthReference.parentRef[directParentKeyName])) {
            const operationList = objectDepthReference.parentRef[directParentKeyName];
            const childListWithItsRef = [];
            for (const opr of operationList) {
                if (!opr[directChildKeyName])
                    continue;
                const deRefChildList = JSON.parse(JSON.stringify(opr[directChildKeyName] || []));
                delete opr[directChildKeyName];
                for (const childOpr of Array.isArray(deRefChildList)
                    ? deRefChildList
                    : [deRefChildList]) {
                    childListWithItsRef.push(Object.assign(Object.assign({}, opr), { [directChildKeyName]: childOpr }));
                }
            }
            objectDepthReference.parentRef[directParentKeyName] = childListWithItsRef;
        }
        else {
            const operationObj = objectDepthReference.parentRef[directParentKeyName];
            const iterables = JSON.parse(JSON.stringify(operationObj[directChildKeyName] || []));
            const childListWithItsRef = [];
            delete operationObj[directChildKeyName];
            for (const opr of iterables) {
                childListWithItsRef.push(Object.assign(Object.assign({}, operationObj), { [directChildKeyName]: opr }));
            }
            objectDepthReference.parentRef[directParentKeyName] = childListWithItsRef;
        }
        return ObjectFlatten.processFlattenObject(processingObject.flat());
    }
}
exports.ObjectFlatten = ObjectFlatten;
//# sourceMappingURL=object-flatten.js.map