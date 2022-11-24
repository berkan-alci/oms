import HttpClient, { RequestOptsAbs } from '../core/http';
/**
 * Describes service type with type, version and constructor
 */
export interface ServiceType<T> {
    readonly type: string;
    new (url: string, client: HttpClient): T;
}
/**
 * Service represents single service client
 */
export default abstract class Service {
    static readonly type: string;
    client: HttpClient;
    projectID: string;
    protected constructor(url: string, client: HttpClient);
}
/**
 * Abstract page having only default properties
 */
export interface Page {
    [key: string]: string | unknown[] | undefined;
    readonly schema?: string;
    readonly next?: string;
    readonly first?: string;
}
/**
 * Pager for lazy pagination implementation. <T> describes page structure
 */
export declare class Pager<T extends Page> implements AsyncIterable<T>, AsyncIterator<T, undefined> {
    readonly client: HttpClient;
    readonly pageOpts: RequestOptsAbs;
    private firstIteration;
    constructor(opts: RequestOptsAbs, client: HttpClient);
    [Symbol.asyncIterator](): Pager<T>;
    /**
     * Load next paginator page
     */
    next(): Promise<IteratorResult<T, undefined>>;
    /**
     * Get single page with all page data
     */
    all(): Promise<T>;
    mergeTwoPages(base?: T, other?: T): T;
}
/**
 * Wait for condition to become `true` with increasing retry interval
 * @param condition
 * @param timeoutSeconds
 */
export declare function waitFor(condition: () => Promise<boolean>, timeoutSeconds: number): Promise<void>;
/**
 * Wait for resource to be deleted with increasing retry interval
 * @param checkMethod - method, possibly returning `HttpError(404)`
 * @param timeoutSeconds - maximum timeout
 */
export declare function waitForResourceToBeDeleted(checkMethod: () => Promise<unknown>, timeoutSeconds: number): Promise<void>;
