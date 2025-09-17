"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const main_1 = require("./main");
const mock_1 = require("./mock");
(0, globals_1.describe)("ObjectFlattener", () => {
    (0, globals_1.test)("ObjectFlattener.toDataTableFromObject - single data processor", () => {
        const md = main_1.ObjectFlattener.toDataTableFromObject(JSON.parse(JSON.stringify(mock_1.DOCUMENT_TYPE_2)), {
            keysAsColumn: true,
        });
        if (!md) {
            expect(true).toBe(false);
        }
        if (md.isError) {
            expect(true).toBe(false);
        }
    });
    (0, globals_1.test)("ObjectFlattener.toDataTableFromListAsStream - large Data set processor", () => __awaiter(void 0, void 0, void 0, function* () {
        const md = main_1.ObjectFlattener.toDataTableFromListAsStream([
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
            mock_1.DOCUMENT_TYPE_2,
        ].map((d) => JSON.parse(JSON.stringify(d))));
        try {
            const { completed } = yield new Promise((resolve, reject) => {
                md.on("data", (data) => { });
                md.on("error", (error) => {
                    reject(error);
                });
                md.on("end", (data) => {
                    resolve(data);
                });
            });
            if (!completed) {
                expect(true).toBe(false);
            }
        }
        catch (err) {
            expect(true).toBe(false);
        }
    }));
    (0, globals_1.test)("ObjectFlattener.toDataTableFromFile - large Data set processor from network", () => __awaiter(void 0, void 0, void 0, function* () {
        const md = main_1.ObjectFlattener.toDataTableFromFile("https://si-file-manager-latest.onrender.com/uploads/ef8020a3-af40-458f-8970-87cfa7a586d7.json", {
            keysAsColumn: true,
        });
        try {
            const { completed } = yield new Promise((resolve, reject) => {
                md.on("data", (data) => { });
                md.on("error", (error) => {
                    reject(error);
                });
                md.on("end", (data) => {
                    resolve(data);
                });
            });
            if (!completed) {
                expect(true).toBe(false);
            }
        }
        catch (err) {
            expect(true).toBe(false);
        }
    }));
    (0, globals_1.test)("ObjectFlattener.toDataTableFromFile - large Data set processor from file", () => __awaiter(void 0, void 0, void 0, function* () {
        const md = main_1.ObjectFlattener.toDataTableFromFile("./mock/file.json", {
            keysAsColumn: true,
        });
        try {
            const { completed } = yield new Promise((resolve, reject) => {
                md.on("data", (data) => { });
                md.on("error", (error) => {
                    reject(error);
                });
                md.on("end", (data) => {
                    resolve(data);
                });
            });
            if (!completed) {
                expect(true).toBe(false);
            }
        }
        catch (err) {
            expect(true).toBe(false);
        }
    }));
});
//# sourceMappingURL=main.spec.js.map