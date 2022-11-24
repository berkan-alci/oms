import HttpClient from '../../../core/http';
export interface ExtraDHCPOpt {
    readonly opt_value: string;
    readonly opts_name: string;
}
export interface Subnet {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly cidr: string;
    readonly gateway_ip: string;
    readonly dhcp_enable: boolean;
    readonly primary_dns: string;
    readonly secondary_dns: string;
    readonly dnsList: string[];
    readonly availability_zone: string;
    readonly vpc_id: string;
    readonly status: 'ACTIVE' | 'UNKNOWN' | 'ERROR';
    readonly neutron_network_id: string;
    readonly neutron_subnet_id: string;
    readonly extra_dhcp_opts: ExtraDHCPOpt[];
}
export interface CreateOpts {
    readonly name: string;
    readonly description?: string;
    readonly cidr: string;
    readonly gateway_ip: string;
    readonly dhcp_enable?: boolean;
    readonly primary_dns?: string;
    readonly secondary_dns?: string;
    readonly dnsList?: string[];
    readonly availability_zone?: string;
    readonly vpc_id: string;
    readonly extra_dhcp_opts?: ExtraDHCPOpt[];
}
export declare function listSubnets(client: HttpClient, vpcID?: string): Promise<Subnet[]>;
export declare function createSubnet(client: HttpClient, opts: CreateOpts): Promise<Subnet>;
export declare function getSubnetStatus(client: HttpClient, subnetID: string): Promise<Subnet>;
export declare function deleteSubnet(client: HttpClient, vpcID: string, subnetID: string): Promise<void>;
