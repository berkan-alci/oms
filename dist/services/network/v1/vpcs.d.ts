import HttpClient from '../../../core/http';
export declare const url = "/vpcs";
export interface VPC {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly cidr: string;
    readonly status: 'CREATING' | 'OK';
    readonly routes: {
        readonly destination: string;
        readonly nexthop: string;
    }[];
    readonly enable_shared_snat?: boolean;
}
export interface CreateOpts {
    name?: string;
    description?: string;
    cidr?: string;
}
export declare function listVPCs(client: HttpClient): Promise<VPC[]>;
export declare function createVPC(client: HttpClient, opts: CreateOpts): Promise<VPC>;
export interface Route {
    destination?: string;
    nexthop?: string;
}
export interface UpdateOpts extends CreateOpts {
    routes?: Route[];
    enable_shared_snat?: boolean;
}
export declare function updateVPC(client: HttpClient, vpcID: string, opts: UpdateOpts): Promise<VPC>;
export declare function deleteVPC(client: HttpClient, vpcID: string): Promise<void>;
export declare function getVPCStatus(client: HttpClient, vpcID: string): Promise<VPC>;
