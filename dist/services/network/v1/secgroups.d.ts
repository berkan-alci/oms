import HttpClient, { QueryParams } from '../../../core/http';
export interface SecurityGroupRole {
    readonly id: string;
    readonly description: string;
    readonly security_group_id: string;
    readonly direction: 'egress' | 'ingress';
    readonly ethertype: 'IPv4' | 'IPv6';
    readonly protocol: 'icmp' | 'tcp' | 'udp' | '';
    readonly port_range_min: number;
    readonly port_range_max: number;
    readonly remote_ip_prefix?: string;
    readonly remote_group_id?: string;
    readonly tenant_id: string;
}
export interface SecurityGroup {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly vpc_id?: string;
    readonly security_group_rules: SecurityGroupRole[];
}
export interface ListOpts extends QueryParams {
    readonly vpc_id?: string;
}
export declare function listSecurityGroups(client: HttpClient, opts: ListOpts): Promise<SecurityGroup[]>;
export interface CreateOpts {
    readonly name: string;
}
export declare function createSecurityGroup(client: HttpClient, opts: CreateOpts): Promise<SecurityGroup>;
export declare function deleteSecurityGroup(client: HttpClient, id: string): Promise<void>;
