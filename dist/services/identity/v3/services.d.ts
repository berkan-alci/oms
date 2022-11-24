import HttpClient from '../../../core/http';
export interface ServiceRef {
    readonly name: string;
    readonly type: string;
    readonly links: {
        readonly next?: string;
        readonly previous?: string;
        readonly self: string;
    };
    readonly id: string;
    readonly enabled: boolean;
}
export declare function listServices(client: HttpClient): Promise<ServiceRef[]>;
