import HttpClient from '../../../../core/http';
import { Metadata } from '../../../../core';
import { Container, ContainerMetadata, ObjectListOpts } from './types';
export interface ContainerACLs {
    /**
     * ContainerMetadata **read** ACL rules are as follows:
     *
     * `.r:*#`: All referrers
     *
     * `.r:example.com,swift.example.com#`: Comma-separated list of referrers
     *
     * `.rlistings#`: ContainerMetadata listing access, always combined with `.r:`
     *
     * `.r:-example.com`#: Comma-separated list of inaccessible addresses
     *
     * `{account:user} #`: account is projectid and user is userid
     *
     */
    readonly read?: string;
    /**
     * ContainerMetadata **write** ACL rules are as follows:
     *
     * `{account:user} #`: Only this format is supported. account is projectid and user is userid.
     */
    readonly write?: string;
}
export declare function createContainer(client: HttpClient, name: string, acl?: ContainerACLs, metadata?: Metadata): Promise<void>;
export declare function getContainer(client: HttpClient, name: string, opts?: ObjectListOpts): Promise<Container>;
export declare function showContainerMetadata(client: HttpClient, name: string): Promise<ContainerMetadata>;
export declare function deleteContainer(client: HttpClient, name: string): Promise<void>;
