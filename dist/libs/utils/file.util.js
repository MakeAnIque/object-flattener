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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtil = void 0;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const stream_1 = require("stream");
const util_1 = require("util");
/**
 * Utility class for file operations, focused on generating batches from JSONL files or URLs.
 * Supports resumable processing with progress tracking, retries for network failures, and handling both local files and remote URLs.
 * Progress is stored in-memory (could be extended to persistent storage).
 */
class FileUtil {
    /**
     * Async generator that yields batches of JSON objects from a JSONL file (local or URL), with resume on failure.
     * Handles network retries for URLs, skips already processed lines, and tracks progress for resumability.
     * Yields batches along with metadata like iteration count, total lines, and processed count.
     * @param filePathOrUrl - Local file path or HTTP URL to the JSONL file.
     * @param batchSize - Number of items per batch (default: 10).
     * @param maxRetries - Maximum number of retries for network failures (default: 3).
     * @param logging - Enable logging for warnings (default: true, but not actively used in code beyond console.warn).
     * @yields {{ batch: Array<Object>, iteration: number, totalLines: number, processedCount: number }} - Batch of JSON objects, current iteration, total lines, and processed line count.
     * @throws Error - On failure after max retries or unrecoverable errors.
     */
    static jsonlBatchGenerator(filePathOrUrl_1) {
        return __asyncGenerator(this, arguments, function* jsonlBatchGenerator_1(filePathOrUrl, batchSize = 10, maxRetries = 3, logging = true) {
            var _a, e_1, _b, _c, _d, e_2, _e, _f;
            var _g;
            const isUrl = filePathOrUrl.startsWith("http://") ||
                filePathOrUrl.startsWith("https://");
            const progressKey = filePathOrUrl;
            let progress = FileUtil.progressStore.get(progressKey) || {
                processedCount: 0,
                lineNum: 0,
                byteOffset: 0,
            };
            // Function to count total lines (local or URL)
            const countTotalLines = () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (isUrl) {
                    const response = yield (0, node_fetch_1.default)(filePathOrUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    let lineCount = 0;
                    let buffer = "";
                    // Use empty stream if response.body is null
                    const stream = (_a = response.body) !== null && _a !== void 0 ? _a : stream_1.Readable.from([]);
                    return new Promise((resolve, reject) => {
                        stream.on("data", (chunk) => {
                            buffer += chunk.toString();
                            const lines = buffer.split("\n");
                            buffer = lines.pop() || "";
                            lineCount += lines.length;
                        });
                        stream.on("end", () => resolve(lineCount));
                        stream.on("error", reject);
                    });
                }
                else {
                    return new Promise((resolve, reject) => {
                        let lineCount = 0;
                        const stream = fs_1.default.createReadStream(filePathOrUrl);
                        const rl = readline_1.default.createInterface({
                            input: stream,
                            crlfDelay: Infinity,
                        });
                        rl.on("line", () => lineCount++);
                        rl.on("error", reject);
                        rl.on("close", () => resolve(lineCount));
                    });
                }
            });
            // Get total lines
            let totalLines = yield __await(countTotalLines());
            let batch = [];
            let iteration = Math.floor(progress.processedCount / batchSize) + 1;
            let processedCount = progress.processedCount;
            let lineNum = 0;
            let byteOffset = progress.byteOffset || 0;
            if (isUrl) {
                // Handle URL with retries and resume
                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        const headers = {};
                        if (byteOffset > 0) {
                            headers["Range"] = `bytes=${byteOffset}-`;
                        }
                        const response = yield __await((0, node_fetch_1.default)(filePathOrUrl, { headers }));
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        // Use empty stream if response.body is null
                        const stream = (_g = response.body) !== null && _g !== void 0 ? _g : stream_1.Readable.from([]);
                        let buffer = "";
                        const decoder = new util_1.TextDecoder();
                        try {
                            for (var _h = true, stream_2 = (e_1 = void 0, __asyncValues(stream)), stream_2_1; stream_2_1 = yield __await(stream_2.next()), _a = stream_2_1.done, !_a; _h = true) {
                                _c = stream_2_1.value;
                                _h = false;
                                const chunk = _c;
                                // Ensure chunk is a Buffer
                                const bufferChunk = Buffer.isBuffer(chunk)
                                    ? chunk
                                    : Buffer.from(chunk);
                                byteOffset += bufferChunk.length;
                                buffer += decoder.decode(bufferChunk, { stream: true });
                                const lines = buffer.split("\n");
                                buffer = lines.pop() || ""; // Keep incomplete line
                                for (const line of lines) {
                                    lineNum++;
                                    if (lineNum <= progress.lineNum)
                                        continue; // Skip already processed lines
                                    try {
                                        if (line.trim()) {
                                            const item = JSON.parse(line);
                                            batch.push(item);
                                            processedCount++;
                                            FileUtil.progressStore.set(progressKey, {
                                                processedCount,
                                                lineNum,
                                                byteOffset,
                                            });
                                            if (batch.length === batchSize) {
                                                yield yield __await({
                                                    batch,
                                                    iteration: ++iteration,
                                                    totalLines,
                                                    processedCount,
                                                });
                                                batch = [];
                                            }
                                        }
                                    }
                                    catch (err) {
                                        console.warn(`Warning: Invalid JSON at line ${lineNum}: ${err.message}`);
                                        continue;
                                    }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_h && !_a && (_b = stream_2.return)) yield __await(_b.call(stream_2));
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        break; // Success, exit retry loop
                    }
                    catch (err) {
                        console.warn(`Attempt ${attempt} failed: ${err.message}`);
                        if (attempt === maxRetries) {
                            throw new Error(`Failed after ${maxRetries} attempts: ${err.message}`);
                        }
                        yield __await(new Promise((resolve) => setTimeout(resolve, 1000 * attempt))); // Exponential backoff
                    }
                }
            }
            else {
                // Handle local file
                const fileStream = fs_1.default.createReadStream(filePathOrUrl);
                const rl = readline_1.default.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity,
                });
                try {
                    for (var _j = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield __await(rl_1.next()), _d = rl_1_1.done, !_d; _j = true) {
                        _f = rl_1_1.value;
                        _j = false;
                        const line = _f;
                        lineNum++;
                        if (lineNum <= progress.lineNum)
                            continue; // Skip already processed lines
                        try {
                            if (line.trim()) {
                                const item = JSON.parse(line);
                                batch.push(item);
                                processedCount++;
                                FileUtil.progressStore.set(progressKey, {
                                    processedCount,
                                    lineNum,
                                });
                                if (batch.length === batchSize) {
                                    yield yield __await({
                                        batch,
                                        iteration: ++iteration,
                                        totalLines,
                                        processedCount,
                                    });
                                    batch = [];
                                }
                            }
                        }
                        catch (err) {
                            console.warn(`Warning: Invalid JSON at line ${lineNum}: ${err.message}`);
                            continue;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_j && !_d && (_e = rl_1.return)) yield __await(_e.call(rl_1));
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (batch.length > 0) {
                yield yield __await({ batch, iteration: ++iteration, totalLines, processedCount }); // Yield any remaining items
                FileUtil.progressStore.set(progressKey, {
                    processedCount,
                    lineNum,
                    byteOffset,
                });
            }
        });
    }
    /**
     * Clears the progress state for a specific file path or URL from the in-memory store.
     * Useful for resetting processing state before re-running the generator.
     * @param filePathOrUrl - The key (file path or URL) for which to clear progress.
     */
    static clearProgress(filePathOrUrl) {
        FileUtil.progressStore.delete(filePathOrUrl);
    }
}
exports.FileUtil = FileUtil;
// In-memory progress store (could be persisted to a file/database)
FileUtil.progressStore = new Map();
//# sourceMappingURL=file.util.js.map