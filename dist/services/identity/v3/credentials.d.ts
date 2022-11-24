import HttpClient from '../../../core/http';
export interface Credential {
    readonly user_id: string;
    readonly description?: string;
    readonly access?: string;
    readonly secret?: string;
    readonly status?: string;
}
/**
 * Create permanent AK/SK
 */
export declare function createCredential(client: HttpClient, userID: string, description?: string): Promise<Credential>;
