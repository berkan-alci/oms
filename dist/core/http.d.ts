import { ParsedQuery } from 'query-string';
import { JSONSchema } from './types';
export type RequestConfigHandler = (i: RequestOpts) => RequestOpts;
export interface JSONResponse<T> extends Response {
    data: T;
    raw: Blob;
}
export declare class HttpError extends Error {
    name: string;
    statusCode: number;
    constructor(statusCode: number, message?: string);
}
export declare class RequestError extends Error {
}
export interface QueryParams {
    [key: string]: unknown;
}
type AbsHeaders = HeadersInit | Record<string, string | boolean | number | undefined>;
export interface RequestOptsAbs {
    url?: string;
    baseURL?: string;
    method?: string;
    params?: ParsedQuery | QueryParams;
    headers?: AbsHeaders;
    json?: Record<string, unknown>;
    handler?: RequestConfigHandler;
    schema?: JSONSchema;
}
/**
 * Merge existing sets of headers producing new Headers instance
 */
export declare function mergeHeaders(one?: AbsHeaders, two?: AbsHeaders): Headers;
/**
 * This is presentation of prepared request opts
 */
export declare class RequestOpts implements RequestOptsAbs {
    url: string;
    baseURL?: string;
    method: string;
    params: ParsedQuery;
    headers: Headers;
    json?: Record<string, unknown>;
    body?: string;
    handler?: RequestConfigHandler;
    schema: JSONSchema;
    constructor(abs: RequestOptsAbs);
}
/**
 * Pre-request config handlers
 * You can iterate over peloton, last and first are available only directly.
 * The `first` and `last` are special cases. Don't use them except you know
 * this handler absolutely _must_ be the first or the last one.
 * Otherwise just use `.push(...)` to add the handler
 */
export declare class Handlers implements Iterable<RequestConfigHandler> {
    first?: RequestConfigHandler;
    private readonly peloton;
    signing?: RequestConfigHandler;
    last?: RequestConfigHandler;
    [Symbol.iterator](): Iterator<RequestConfigHandler>;
    push(handler: RequestConfigHandler): void;
}
export default class HttpClient {
    baseConfig: RequestOptsAbs;
    beforeRequest: Handlers;
    constructor(baseConfig?: RequestOptsAbs);
    /**
     * Create new HttpClient inheriting all client settings
     */
    child(overrideConfig?: RequestOptsAbs): HttpClient;
    /**
     * Base request method
     *
     * #### NB! this method can return object not matching given type value
     */
    request<T>(opts: RequestOptsAbs): Promise<JSONResponse<T>>;
    get<T>(opts: RequestOptsAbs): Promise<JSONResponse<T>>;
    post<T>(opts: RequestOptsAbs): Promise<JSONResponse<T>>;
    put<T>(opts: RequestOptsAbs): Promise<JSONResponse<T>>;
    delete(opts: RequestOptsAbs): Promise<JSONResponse<unknown>>;
    head(opts: RequestOptsAbs): Promise<JSONResponse<unknown>>;
}
export declare function joinURL(...parts: string[]): string;
export {};
