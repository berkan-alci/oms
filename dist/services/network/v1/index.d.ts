import Service from '../../base';
import HttpClient from '../../../core/http';
import { CreateOpts as VPCCreateOpts, UpdateOpts, VPC } from './vpcs';
import { CreateOpts as SubnetCreateOpts, Subnet } from './subnets';
import { CreateOpts as SGCreateOpts, ListOpts as SecGroupListOpts, SecurityGroup } from './secgroups';
import { PublicIP } from './eips';
export { VPC } from './vpcs';
export { Subnet } from './subnets';
/**
 * VPC v1 service client
 */
export declare class VpcV1 extends Service {
    static readonly type = "vpc";
    constructor(url: string, client: HttpClient);
    /**
     * Get list of all existing VPCs
     */
    listVPCs(): Promise<VPC[]>;
    /**
     * Create new VPC
     * @param opts
     */
    createVPC(opts: VPCCreateOpts): Promise<VPC>;
    /**
     * Get existing VPC details
     * @param vpcID
     */
    getVPC(vpcID: string): Promise<VPC>;
    /**
     * Update existing VPC
     * @param vpcID
     * @param opts
     */
    updateVPC(vpcID: string, opts: UpdateOpts): Promise<VPC>;
    /**
     * Delete existing VPC
     * @param vpcID
     */
    deleteVPC(vpcID: string): Promise<void>;
    /**
     * List existing subnets
     * @param vpcID
     */
    listSubnets(vpcID?: string): Promise<Subnet[]>;
    /**
     * Get existing subnet by ID
     * @param subnetID
     */
    getSubnet(subnetID: string): Promise<Subnet>;
    /**
     * Create new subnet with given opts
     * @param opts
     */
    createSubnet(opts: SubnetCreateOpts): Promise<Subnet>;
    /**
     * Delete existing subnet by ID
     * @param subnetID
     * @param vpcID - (optional) subnet`s VPC
     */
    deleteSubnet(subnetID: string, vpcID?: string): Promise<void>;
    /**
     * List existing security groups
     * @param opts
     */
    listSecurityGroups(opts?: SecGroupListOpts): Promise<SecurityGroup[]>;
    /**
     * Create new security group
     * @param opts
     */
    createSecurityGroup(opts: SGCreateOpts): Promise<SecurityGroup>;
    /**
     * Delete existing security group
     * @param id
     */
    deleteSecurityGroup(id: string): Promise<void>;
    /**
     * List all public IPs assigned to the project
     */
    listPublicIPs(): Promise<PublicIP[]>;
}
