import { AuthOptions } from '../../../core';
import HttpClient from '../../../core/http';
interface Domain {
    readonly id: string;
    readonly name: string;
}
interface AuthRecord {
    id: string;
    name: string;
    domain: Domain;
}
export interface CatalogEntity {
    readonly type: string;
    readonly id: string;
    readonly name: string;
    readonly endpoints: {
        readonly url: string;
        readonly region: string;
        readonly region_id: string;
        readonly interface: string;
        readonly id: string;
    }[];
}
interface ResponseTokenInfo {
    readonly user: AuthRecord;
    readonly project?: AuthRecord;
    readonly catalog?: CatalogEntity[];
}
export interface ResponseToken extends ResponseTokenInfo {
    readonly id: string;
}
/**
 * Get permanent auth token
 * @param client - HTTP client to use
 * @param authOptions
 * @param nocatalog - not attach catalog to token
 */
export declare function createToken(client: HttpClient, authOptions: AuthOptions, nocatalog?: boolean): Promise<ResponseToken>;
/**
 * Verifying a Token
 * @param client
 * @param token - tokenID to be verified
 * @param nocatalog - not attach catalog to token
 */
export declare function verifyToken(client: HttpClient, token: string, nocatalog?: boolean): Promise<ResponseToken>;
export {};
