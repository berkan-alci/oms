import { AuthOptions } from '../../../core';
import Service from '../../base';
import { CatalogEntity, ResponseToken } from './tokens';
import { Credential } from './credentials';
import { ListOpts as ProjectListOpts, Project } from './projects';
import HttpClient from '../../../core/http';
export * from './tokens';
export * from './endpoints';
export * from './credentials';
export * from './services';
export declare class IdentityV3 extends Service {
    static readonly type = "identity";
    constructor(url: string, httpClient: HttpClient);
    /**
     * Get permanent auth token
     */
    issueToken(credentials: AuthOptions, noCatalog?: boolean): Promise<ResponseToken>;
    /**
     * Get existing token information
     */
    verifyToken(tokenID: string, noCatalog?: boolean): Promise<ResponseToken>;
    /**
     * Create permanent AK/SK
     * @param userID
     * @param description
     */
    getAKSK(userID: string, description?: string): Promise<Credential>;
    /**
     * List available projects (tenants)
     */
    listProjects(opts?: ProjectListOpts): Promise<Project[]>;
    /**
     * List available service endpoints
     */
    listCatalog(): Promise<CatalogEntity[]>;
}
