import { DataType } from "../enums"; // Assuming DataType enum is imported from enums file
import { TObject } from "../types/object-flatten.types"; // Assuming TObject type is imported from types file

export class DotNotation {
  /**
   * Recursively flattens a nested object using dot notation.
   * @param jsonObject - The object to flatten.
   * @param parentKey - The current parent key in the recursion (default is empty string).
   * @param result - The partial result object where flattened key-value pairs are stored.
   * @returns Partial<TObject> - The flattened partial object.
   */
  public static parse(
    jsonObject: TObject,
    parentKey: string = "",
    result: Partial<TObject> = {}
  ): Partial<TObject> {
    for (let key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (Array.isArray(jsonObject[key])) {
          jsonObject[key].forEach((item, index) => {
            DotNotation.parse(item, `${newKey}[${index}]`, result);
          });
        } else if (
          typeof jsonObject[key] === DataType.OBJECT &&
          jsonObject[key] !== null
        ) {
          DotNotation.parse(
            jsonObject[key] as unknown as TObject,
            newKey,
            result
          );
        } else {
          result[newKey] = jsonObject[key];
        }
      }
    }
    return result;
  }
}
