import HttpClient from '../../../../core/http';
import { Account, AccountMetadata } from './types';
import { Metadata } from '../../../../core';
/**
 * Get account details and list containers
 */
export declare function getAccount(client: HttpClient): Promise<Account>;
/**
 * Update account metadata
 * @param client
 * @param metadata
 * @param quota - Configures the tenant quota. The value ranges from `0` to `9223372036854775807`.
 * After setting the quota, the quota will be checked each time you upload or copy an object,
 * or modify the metadata of an object or bucket. If set to -1, quota will be removed.
 */
export declare function updateAccountMetadata(client: HttpClient, metadata?: Metadata, quota?: number): Promise<void>;
export declare function showAccountMetadata(client: HttpClient): Promise<AccountMetadata>;
