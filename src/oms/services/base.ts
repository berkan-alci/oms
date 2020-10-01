import HttpClient, { HttpError, RequestOptsAbs } from '../core/http'

/**
 * Describes service type with type, version and constructor
 */
export interface ServiceType<T> {
    readonly type: string

    new(url: string, client: HttpClient): T
}

/**
 * Service represents single service client
 */
export default abstract class Service {
    static readonly type: string = ''
    client: HttpClient

    protected constructor(url: string, client: HttpClient) {
        this.client = client.child({ baseURL: url })
    }
}

/**
 * Return base service url, e.g. https://iam.eu-de.otc.t-systems.com/
 * @param serviceUrl - url from service catalog
 */
export function bareUrl(serviceUrl: string): string {
    const url = new URL(serviceUrl)
    return `${url.protocol}//${url.host}`
}

/**
 * Abstract page having only default properties
 */
export interface Page {
    readonly schema?: string
    readonly next?: string
    readonly first?: string
}

/**
 * Pager for lazy pagination implementation. <T> describes page structure
 */
export class Pager<T extends Page> implements AsyncIterable<T>, AsyncIterator<T, T> {
    // Service-bind http client
    readonly client: HttpClient
    readonly pageOpts: RequestOptsAbs

    private firstIteration: boolean

    constructor(opts: RequestOptsAbs, client: HttpClient) {
        this.pageOpts = opts
        this.client = client
        this.firstIteration = true
    }

    [Symbol.asyncIterator](): Pager<T> {
        return this
    }

    /**
     * Load next paginator page
     */
    async next(): Promise<IteratorResult<T, T>> {
        const resp = await this.client.get<T>(this.pageOpts)
        this.pageOpts.url = resp.data.next   // change next request url
        if (this.firstIteration) {
            this.pageOpts.params = undefined // remove params, the are already part of `next`
            this.firstIteration = false
        }
        return { value: resp.data, done: !resp.data.next }
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const maxInterval = 40000

/**
 * Wait for condition to become `true` with increasing retry interval
 * @param condition
 * @param timeoutSeconds
 */
export async function waitFor(condition: () => Promise<boolean>, timeoutSeconds: number): Promise<void> {
    const timeLimit = Date.now() + timeoutSeconds * 1000
    let pause = 1000
    while (timeLimit > Date.now()) {
        if (await condition()) {
            return
        }
        await sleep(pause)
        if (pause < maxInterval) {
            pause += pause
        }
    }
    throw Error(`Timeout (${timeoutSeconds}s) reached waiting for condition ${condition}`)
}

/**
 * Wait for resource to be deleted with increasing retry interval
 * @param checkMethod - method, possibly returning `HttpError(404)`
 * @param timeoutSeconds - maximum timeout
 */
export async function waitForResourceToBeDeleted(checkMethod: () => Promise<unknown>, timeoutSeconds: number): Promise<void> {
    const timeLimit = Date.now() + timeoutSeconds * 1000
    let pause = 0
    while (timeLimit > Date.now()) {
        await sleep(pause)
        try {
            await checkMethod()
        } catch (e) {
            if (e instanceof HttpError && e.statusCode === 404) {
                return
            }
            throw e
        }
        pause += 1000
    }
    throw Error(`Timeout (${timeoutSeconds}s) reached waiting for resource to be unavailable`)
}
