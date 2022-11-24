import Service from '../../../base';
import HttpClient from '../../../../core/http';
import { ContainerACLs } from './container';
import { Metadata } from '../../../../core';
import { Account, AccountMetadata, Container, ContainerMetadata, ObjectListOpts } from './types';
export declare class SwiftV1 extends Service {
    static readonly type: string;
    constructor(url: string, client: HttpClient);
    /**
     * Get AccountMetadata details and container list
     */
    getAccount(): Promise<Account>;
    /**
     * Get AccountMetadata details
     */
    showAccountMetadata(): Promise<AccountMetadata>;
    /**
     * Update account metadata
     * @param metadata
     * @param quota - Configures the tenant quota. The value ranges from `0` to `9223372036854775807`.
     * After setting the quota, the quota will be checked each time you upload or copy an object,
     * or modify the metadata of an object or bucket. If set to -1, quota will be removed.
     */
    updateAccountMetadata(metadata?: Metadata, quota?: number): Promise<void>;
    createContainer(name: string, acls?: ContainerACLs, metadata?: Metadata): Promise<void>;
    listContainers(): Promise<ContainerMetadata[]>;
    showContainerMetadata(name: string): Promise<ContainerMetadata>;
    getContainer(name: string, objectListOpts?: ObjectListOpts): Promise<Container>;
    deleteContainer(name: string): Promise<void>;
}
