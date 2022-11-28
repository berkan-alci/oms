"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinURL = exports.Handlers = exports.RequestOpts = exports.mergeHeaders = exports.RequestError = exports.HttpError = void 0;
/**
 * Simple implementation of HTTP client based on `fetch` with
 * possibility to inject pre-request configuration handlers
 */
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const query_string_1 = require("query-string");
const json_schema_1 = require("json-schema");
const cross_fetch_1 = __importStar(require("cross-fetch"));
const absUrlRe = /^https?:\/\/.+/;
class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'HTTPError';
        this.statusCode = statusCode;
    }
}
exports.HttpError = HttpError;
class RequestError extends Error {
}
exports.RequestError = RequestError;
/**
 * Convert input header-like object to list of headers
 */
function normalizeHeaders(src) {
    const result = new cross_fetch_1.Headers();
    if (!src) {
        return result;
    }
    if (src instanceof cross_fetch_1.Headers) {
        return new cross_fetch_1.Headers(src);
    }
    Object.entries(src)
        .forEach(e => {
        if (e[1] != null) {
            result.append(e[0], String(e[1]));
        }
    });
    return result;
}
/**
 * Merge existing sets of headers producing new Headers instance
 */
function mergeHeaders(one, two) {
    if (!one && !two) {
        return new cross_fetch_1.Headers();
    }
    const headers = normalizeHeaders(one);
    if (two) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        for (const [k, v] of normalizeHeaders(two)) {
            headers.append(k, v);
        }
    }
    return headers;
}
exports.mergeHeaders = mergeHeaders;
/**
 * This is presentation of prepared request opts
 */
class RequestOpts {
    constructor(abs) {
        // check absolutely minimal requirements:
        if (!abs.method) {
            throw new RequestError(`Request without Method: ${JSON.stringify(abs)}`);
        }
        this.method = abs.method;
        if (abs.url == null) {
            throw new RequestError(`Request without URL: ${JSON.stringify(abs)}`);
        }
        this.url = abs.url;
        this.headers = mergeHeaders(abs.headers);
        const outParams = {};
        const inParams = abs.params;
        if (inParams) {
            Object.keys(inParams).forEach(k => {
                const v = inParams[k];
                if (v != null) {
                    outParams[k] = String(inParams[k]);
                }
            });
        }
        this.params = outParams;
        if (abs.json) {
            this.body = JSON.stringify(abs.json);
        }
        if (abs.handler) {
            this.handler = abs.handler;
        }
        this.schema = abs.schema ? abs.schema : {};
    }
}
exports.RequestOpts = RequestOpts;
function prepareConfig(base) {
    const baseConfig = base && !(0, isEmpty_1.default)(base) ? (0, cloneDeep_1.default)(base) : {};
    baseConfig.headers = mergeHeaders(baseConfig.headers);
    return baseConfig;
}
/**
 * Pre-request config handlers
 * You can iterate over peloton, last and first are available only directly.
 * The `first` and `last` are special cases. Don't use them except you know
 * this handler absolutely _must_ be the first or the last one.
 * Otherwise just use `.push(...)` to add the handler
 */
class Handlers {
    constructor() {
        this.peloton = [];
    }
    *[Symbol.iterator]() {
        yield* this.peloton.reverse();
    }
    push(handler) {
        this.peloton.push(handler);
    }
}
exports.Handlers = Handlers;
class HttpClient {
    constructor(baseConfig) {
        this.baseConfig = prepareConfig(baseConfig);
        this.beforeRequest = new Handlers();
    }
    /**
     * Create new HttpClient inheriting all client settings
     */
    child(overrideConfig) {
        const client = (0, cloneDeep_1.default)(this);
        client.baseConfig = overrideConfig ? prepareConfig(overrideConfig) : prepareConfig();
        return client;
    }
    /**
     * Base request method
     *
     * #### NB! this method can return object not matching given type value
     */
    request(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let merged = new RequestOpts(opts);
            if (!merged.baseURL) {
                merged.baseURL = this.baseConfig.baseURL;
            }
            merged.headers = mergeHeaders(this.baseConfig.headers, merged.headers);
            // handlers are executed in order: beforeRequest.first, opts.handler,
            // beforeRequest.peloton, ..., beforeRequest.last
            // note that beforeRequest.last executed just before `fetch` and receives 100%
            // prepared request
            if (this.beforeRequest.first) {
                merged = this.beforeRequest.first(merged);
            }
            if (merged.handler) {
                merged = merged.handler(merged);
            }
            for (const b of this.beforeRequest) {
                merged = b(merged);
            }
            let { baseURL, url } = merged;
            baseURL = baseURL ? baseURL : this.baseConfig.baseURL;
            if (!url.match(absUrlRe) && !!baseURL) {
                url = joinURL(baseURL, url);
            }
            // append query params
            if (merged.params) {
                url = (0, query_string_1.stringifyUrl)({
                    url,
                    query: merged.params,
                }, { encode: true, skipNull: true });
            }
            merged.url = url;
            merged.baseURL = '';
            if (this.beforeRequest.signing) {
                merged = this.beforeRequest.signing(merged);
            }
            if (this.beforeRequest.last) {
                merged = this.beforeRequest.last(merged);
            }
            url = merged.url;
            const response = yield (0, cross_fetch_1.default)(url, merged);
            if (!response.ok) {
                const strHeaders = {};
                merged.headers.forEach((v, k) => {
                    if (k.toLowerCase().endsWith('-token')) {
                        const tSize = v.length;
                        strHeaders[k] = `${v.substring(0, 10)}...${v.substring(tSize - 10, tSize)}`;
                    }
                    else {
                        strHeaders[k] = v;
                    }
                });
                const strOpts = JSON.stringify(merged, (k, v) => {
                    if (k === 'headers') {
                        return strHeaders;
                    }
                    return v;
                });
                const message = `HTTP error received. ${response.status} ${response.statusText}: ${yield response.text()}`
                    + `Request Opts:\n${strOpts}`;
                throw new HttpError(response.status, message);
            }
            response.data = {};
            response.raw = yield response.blob();
            if (isJsonResponse(response)) {
                if (response.raw.size) {
                    response.data = JSON.parse(yield response.raw.text());
                }
                // will be validated against own 'schema' field, if one is provided
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const result = (0, json_schema_1.validate)(response.data, merged.schema);
                if (!result.valid) {
                    throw Error(`Failed JSON Schema validation: ${result.errors}`);
                }
            }
            return response;
        });
    }
    get(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts.method = 'GET';
            return yield this.request(opts);
        });
    }
    post(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts.method = 'POST';
            return yield this.request(opts);
        });
    }
    put(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts.method = 'PUT';
            return yield this.request(opts);
        });
    }
    delete(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts.method = 'DELETE';
            return yield this.request(opts);
        });
    }
    head(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            opts.method = 'HEAD';
            return yield this.request(opts);
        });
    }
}
exports.default = HttpClient;
function isJsonResponse(r) {
    const ct = r.headers.get('content-type');
    if (!ct) {
        return false;
    }
    return ct.startsWith('application/json');
}
const barePartRe = /^\/*(.+?)\/*$/;
function joinURL(...parts) {
    const urls = [];
    for (const p of parts) {
        const matches = p.match(barePartRe);
        if (!matches || matches.length !== 2) {
            continue;
        }
        urls.push(matches[1]);
    }
    return urls.join('/');
}
exports.joinURL = joinURL;
//# sourceMappingURL=http.js.map