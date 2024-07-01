import { DOT_NOTATION_MATCH_KEY } from "../constants/object-flatten.constants";
import { CommonUtil } from "./common.utils";
import { describe, expect, test } from "@jest/globals";

describe("CommonUtil", () => {
  test("CommonUtil.sanitizeLevel - for has List Depth", () => {
    const keyList = [
      "0",
      "__DATA_KEY__",
      "DECISION",
      "verificationModule",
      "request",
      "REQUEST",
      "APPLICATION-DATA",
      "PREVIOUS-DECISION-REMARKS[0]",
      "",
    ];
    const filter = DOT_NOTATION_MATCH_KEY;
    const result = CommonUtil.sanitizeLevel(keyList, filter);

    if (!result) {
      expect(false).toBe(true);
    }

    if (!result.length) {
      expect(false).toBe(true);
    }
    const lastResult = result[result.length - 1];
    expect(lastResult.includes("[")).toBe(true);
  });
  test("CommonUtil.sanitizeLevel - for has no List Depth", () => {
    const keyList = [
      "0",
      "__DATA_KEY__",
      "DECISION",
      "verificationModule",
      "request",
      "REQUEST",
      "APPLICATION-DATA",
      "",
    ];
    const filter = DOT_NOTATION_MATCH_KEY;
    const result = CommonUtil.sanitizeLevel(keyList, filter);

    if (!result.length) {
      expect(true).toBe(true);
    }
  });
});
