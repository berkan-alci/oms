var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSignHeaders } from './core';
import HttpClient from './core/http';
import isEmpty from 'lodash/isEmpty';
import { IdentityV3 } from './services';
export * from './core';
export * from './services';
const defaultRegion = 'eu-de';
/**
 * Client is base provider client
 */
export class Client {
    set tokenID(v) {
        this.cloud.auth.token = v;
    }
    get tokenID() {
        return this.cloud.auth.token || '';
    }
    get projectID() {
        return this.cloud.auth.project_id || '';
    }
    set projectID(id) {
        this.cloud.auth.project_id = id;
    }
    get domainID() {
        return this.cloud.auth.domain_id || '';
    }
    set domainID(id) {
        this.cloud.auth.domain_id = id;
    }
    injectCommonHeaders() {
        this.httpClient.beforeRequest.first = addCommonHeaders;
    }
    constructor(cloud) {
        this.akskAuthHeader = 'Authorization';
        this.serviceMap = new Map();
        this.cloud = cloud;
        if (!cloud.region) {
            cloud.region = defaultRegion;
            if (cloud.auth.project_name) {
                cloud.region = cloud.auth.project_name.split('_', 1)[0];
            }
        }
        this.httpClient = new HttpClient({});
        this.injectCommonHeaders();
        // register identity service
        this.registerService('identity', this.cloud.auth.auth_url);
    }
    registerService(type, url) {
        this.serviceMap.set(type, url);
    }
    getService(type) {
        const serviceURL = this.serviceMap.get(type.type);
        if (!serviceURL) {
            throw Error(`Service '${type.type}' is not registered`);
        }
        const srv = new type(serviceURL, this.httpClient);
        srv.projectID = this.projectID;
        return srv;
    }
    getIdentity() {
        return this.getService(IdentityV3);
    }
    /**
     * Load service endpoint catalog for the region
     */
    saveServiceCatalog(catalog) {
        catalog.forEach(ce => {
            const ep = ce.endpoints.find(e => (e.region === this.cloud.region || e.region === '*') &&
                e.interface === 'public');
            if (ep) {
                this.registerService(ce.type, ep.url);
            }
        });
    }
    /**
     * Authenticate with AK/SK
     */
    authAkSk() {
        return __awaiter(this, void 0, void 0, function* () {
            this.httpClient.beforeRequest.signing = (config => {
                if (!this.cloud.auth.ak || !this.cloud.auth.sk) {
                    throw Error(`Missing AK/SK: ${JSON.stringify(this.cloud.auth)}`);
                }
                const url = new URL(config.url);
                const signedHeaders = getSignHeaders({
                    accessKeyId: this.cloud.auth.ak,
                    secretAccessKey: this.cloud.auth.sk,
                    regionName: '',
                }, {
                    method: config.method,
                    url: url,
                    serviceName: '',
                    headers: config.headers,
                }, undefined, config.body);
                if (signedHeaders) {
                    config.headers.set('X-Sdk-Date', signedHeaders['X-Sdk-Date']);
                    config.headers.set(this.akskAuthHeader, signedHeaders.Authorization);
                }
                if (this.projectID !== '') {
                    config.headers.set('X-Project-Id', this.projectID);
                }
                return config;
            });
            const projectName = this.cloud.auth.project_name;
            const iam = this.getIdentity();
            if (!this.projectID && projectName) {
                const proj = yield iam.listProjects({ name: projectName });
                if (!proj || !proj.length) {
                    throw Error(`Project with name ${projectName} doesn't exist`);
                }
                this.projectID = proj[0].id;
                this.domainID = proj[0].domain_id;
            }
            const catalog = yield iam.listCatalog();
            this.saveServiceCatalog(catalog);
        });
    }
    injectAuthToken() {
        this.httpClient.beforeRequest.push(config => {
            if (this.tokenID) {
                config.headers.set('X-Auth-Token', this.tokenID);
            }
            return config;
        });
    }
    /**
     * Authenticate with token
     */
    authToken() {
        return __awaiter(this, void 0, void 0, function* () {
            this.injectAuthToken();
            const identity = this.getIdentity();
            let token;
            if (!this.tokenID) {
                token = yield identity.issueToken(this.cloud.auth);
                this.tokenID = token.id;
            }
            else {
                token = yield identity.verifyToken(this.tokenID);
            }
            if (token.project) {
                this.projectID = token.project.id;
            }
            this.domainID = token.user.domain.id;
            if (!token.catalog) {
                throw Error('No service catalog provided');
            }
            this.saveServiceCatalog(token.catalog);
        });
    }
    /**
     * Authenticate client and populate domainID and projectID
     */
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (isEmpty(this.cloud.auth)) {
                throw new Error('Missing auth options');
            }
            if (this.cloud.auth.ak && this.cloud.auth.sk) {
                yield this.authAkSk();
            }
            else {
                yield this.authToken();
            }
        });
    }
}
const appJSON = 'application/json';
const userAgent = 'OpenTelekomCloud JS/v1.0';
function addCommonHeaders(cfg) {
    cfg.headers.append('User-Agent', userAgent);
    cfg.headers.append('Accept', appJSON);
    cfg.headers.append('Content-Type', appJSON);
    const base = cfg.baseURL || cfg.url || '';
    if (base) {
        cfg.headers.append('Host', new URL(base).host);
    }
    return cfg;
}
//# sourceMappingURL=index.js.map