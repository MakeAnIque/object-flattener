import { describe, test } from "@jest/globals";
import { ObjectFlattener } from "./main";
import { DOCUMENT_TYPE_2 } from "./mock";
import { Readable } from "stream";
import { IObjectFlattenedDataTableSet } from "./libs/interfaces/flatten.interface";
import {
  TObjectFLattenedCompleted,
  TObjectFlattenedInProgress,
  TObjectFLattenedWithError,
} from "./libs/types/object-flatten.types";

describe("ObjectFlattener", () => {
  test("ObjectFlattener.toDataTableFromObject - single data processor", () => {
    const md = ObjectFlattener.toDataTableFromObject(
      JSON.parse(JSON.stringify(DOCUMENT_TYPE_2)),
      {
        keysAsColumn: true,
      }
    );
    if (!md) {
      expect(true).toBe(false);
    }
    if (md.isError) {
      expect(true).toBe(false);
    }
  });

  test("ObjectFlattener.toDataTableFromListAsStream - large Data set processor", async () => {
    const md = ObjectFlattener.toDataTableFromListAsStream(
      (
        [
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
          DOCUMENT_TYPE_2,
        ] as any
      ).map((d: any) => JSON.parse(JSON.stringify(d)))
    ) as Readable;
    try {
      const { completed } = await new Promise<
        Pick<IObjectFlattenedDataTableSet, TObjectFLattenedCompleted>
      >((resolve, reject) => {
        md.on(
          "data",
          (
            data: Pick<IObjectFlattenedDataTableSet, TObjectFlattenedInProgress>
          ) => {}
        );
        md.on(
          "error",
          (
            error: Pick<IObjectFlattenedDataTableSet, TObjectFLattenedWithError>
          ) => {
            reject(error);
          }
        );
        md.on(
          "end",
          (
            data: Pick<IObjectFlattenedDataTableSet, TObjectFLattenedCompleted>
          ) => {
            resolve(data);
          }
        );
      });
      if (!completed) {
        expect(true).toBe(false);
      }
    } catch (err) {
      expect(true).toBe(false);
    }
  });
});
