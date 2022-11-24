import { CloudConfig } from './core';
import Service, { ServiceType } from './services/base';
import HttpClient from './core/http';
import { CatalogEntity } from './services';
export * from './core';
export * from './services';
/**
 * Client is base provider client
 */
export declare class Client {
    /**
     * client provides unauthorized access to public resources
     */
    httpClient: HttpClient;
    cloud: CloudConfig;
    akskAuthHeader: string;
    set tokenID(v: string);
    get tokenID(): string;
    get projectID(): string;
    set projectID(id: string);
    get domainID(): string;
    set domainID(id: string);
    private injectCommonHeaders;
    constructor(cloud: CloudConfig);
    serviceMap: Map<string, string>;
    registerService(type: string, url: string): void;
    getService<S extends Service>(type: ServiceType<S>): S;
    private getIdentity;
    /**
     * Load service endpoint catalog for the region
     */
    saveServiceCatalog(catalog: CatalogEntity[]): void;
    /**
     * Authenticate with AK/SK
     */
    authAkSk(): Promise<void>;
    private injectAuthToken;
    /**
     * Authenticate with token
     */
    authToken(): Promise<void>;
    /**
     * Authenticate client and populate domainID and projectID
     */
    authenticate(): Promise<void>;
}
