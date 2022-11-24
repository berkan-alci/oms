import HttpClient, { QueryParams } from '../../../core/http';
export interface ListOpts extends QueryParams {
    readonly domain_id?: string;
    readonly name?: string;
    readonly parent_id?: string;
    readonly enabled?: boolean;
    readonly is_domain?: boolean;
}
export interface Project {
    readonly id: string;
    readonly enabled: boolean;
    readonly domain_id: string;
    readonly is_domain: boolean;
    readonly parent_id: string;
    readonly name: string;
    readonly description: string;
    readonly links: {
        readonly next: string | null;
        readonly previous: string | null;
        readonly self: string;
    };
}
export declare function listProjects(client: HttpClient, opts?: ListOpts): Promise<Project[]>;
