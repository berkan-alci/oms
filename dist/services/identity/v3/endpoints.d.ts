import HttpClient from '../../../core/http';
export interface Endpoint {
    readonly id: string;
    readonly service_id: string;
    readonly region?: string;
    readonly links: unknown;
    readonly interface: string;
    readonly url: string;
}
export declare function listEndpoints(client: HttpClient): Promise<Endpoint[]>;
