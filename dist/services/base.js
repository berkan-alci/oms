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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForResourceToBeDeleted = exports.waitFor = exports.Pager = void 0;
const http_1 = require("../core/http");
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
/**
 * Service represents single service client
 */
class Service {
    constructor(url, client) {
        this.projectID = '';
        this.client = client.child({ baseURL: url });
    }
}
exports.default = Service;
Service.type = '';
/**
 * Pager for lazy pagination implementation. <T> describes page structure
 */
class Pager {
    constructor(opts, client) {
        this.pageOpts = opts;
        this.client = client;
        this.firstIteration = true;
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    /**
     * Load next paginator page
     */
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pageOpts.url) {
                return { value: undefined, done: true };
            }
            const resp = yield this.client.get(this.pageOpts);
            this.pageOpts.url = resp.data.next; // change next request url
            if (this.firstIteration) {
                this.pageOpts.params = undefined; // remove params, the are already part of `next`
                this.firstIteration = false;
            }
            return { value: resp.data };
        });
    }
    /**
     * Get single page with all page data
     */
    all() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let archPage = undefined;
            let count = 0;
            try {
                for (var _d = true, _e = __asyncValues(this), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const page = _c;
                        count++;
                        archPage = this.mergeTwoPages(archPage, page);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!archPage) {
                throw Error('Failed to get merged pages');
            }
            console.log(`Loaded ${count} pages`);
            return archPage;
        });
    }
    mergeTwoPages(base, other) {
        if (!other) {
            if (!base) {
                throw Error('No pages to merge');
            }
            return base;
        }
        if (!base) {
            return (0, cloneDeep_1.default)(other);
        }
        for (const k in base) {
            if (!base.hasOwnProperty(k) || !other.hasOwnProperty(k)) {
                continue;
            }
            const val1 = base[k];
            const val2 = other[k];
            // merge only data arrays
            if (val1 instanceof Array && val2 instanceof Array) {
                base[k] = val1.concat(...val2);
            }
        }
        return base;
    }
}
exports.Pager = Pager;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const maxInterval = 40000;
/**
 * Wait for condition to become `true` with increasing retry interval
 * @param condition
 * @param timeoutSeconds
 */
function waitFor(condition, timeoutSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeLimit = Date.now() + timeoutSeconds * 1000;
        let pause = 1000;
        while (timeLimit > Date.now()) {
            if (yield condition()) {
                return;
            }
            yield sleep(pause);
            if (pause < maxInterval) {
                pause += pause;
            }
        }
        throw Error(`Timeout (${timeoutSeconds}s) reached waiting for condition ${condition}`);
    });
}
exports.waitFor = waitFor;
/**
 * Wait for resource to be deleted with increasing retry interval
 * @param checkMethod - method, possibly returning `HttpError(404)`
 * @param timeoutSeconds - maximum timeout
 */
function waitForResourceToBeDeleted(checkMethod, timeoutSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        const timeLimit = Date.now() + timeoutSeconds * 1000;
        let pause = 0;
        while (timeLimit > Date.now()) {
            yield sleep(pause);
            try {
                yield checkMethod();
            }
            catch (e) {
                if (e instanceof http_1.HttpError && e.statusCode === 404) {
                    return;
                }
                throw e;
            }
            pause += 1000;
        }
        throw Error(`Timeout (${timeoutSeconds}s) reached waiting for resource to be unavailable`);
    });
}
exports.waitForResourceToBeDeleted = waitForResourceToBeDeleted;
//# sourceMappingURL=base.js.map