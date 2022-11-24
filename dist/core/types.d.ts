import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';
export interface NameOrID {
    readonly id?: string;
    readonly name?: string;
}
/**
 * Simple implementation of OpenStack auth options
 */
export interface AuthOptions {
    auth_url: string;
    token?: string;
    username?: string;
    password?: string;
    domain_name?: string;
    domain_id?: string;
    project_name?: string;
    project_id?: string;
    ak?: string;
    sk?: string;
}
/**
 * OpenTelekomCloud cloud configuration
 */
export interface CloudConfig {
    auth: AuthOptions;
    region?: string;
}
/**
 * CloudConfigHelper provides helper functions to get cloud configurations
 */
declare class CloudConfigHelper {
    readonly config: CloudConfig;
    constructor(authUrl: string);
    withRegion(region: string): CloudConfigHelper;
    withProject(projectName: string): CloudConfigHelper;
    withPassword(domainName: string, username: string, password: string): CloudConfigHelper;
    withToken(token: string): CloudConfigHelper;
    withAKSK(ak: string, sk: string): CloudConfigHelper;
}
/**
 * Returns cloud configuration helper providing simple configuration
 * generation witch chained methods
 * @param authURL
 */
export declare function cloud(authURL: string): CloudConfigHelper;
export declare function normalizeDateTime(date?: string | Date): string | undefined;
export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;
export type Metadata = Record<string, string>;
export {};
