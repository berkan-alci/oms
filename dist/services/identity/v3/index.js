var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Service from '../../base';
import { createToken, verifyToken } from './tokens';
import { createCredential } from './credentials';
import { listProjects } from './projects';
import { listCatalog } from './catalog';
export * from './tokens';
export * from './endpoints';
export * from './credentials';
export * from './services';
export class IdentityV3 extends Service {
    constructor(url, httpClient) {
        if (url.endsWith('/v3')) {
            url = url.slice(0, -3);
        }
        super(url, httpClient);
    }
    /**
     * Get permanent auth token
     */
    issueToken(credentials, noCatalog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield createToken(this.client, credentials, noCatalog);
        });
    }
    /**
     * Get existing token information
     */
    verifyToken(tokenID, noCatalog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield verifyToken(this.client, tokenID, noCatalog);
        });
    }
    /**
     * Create permanent AK/SK
     * @param userID
     * @param description
     */
    getAKSK(userID, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield createCredential(this.client, userID, description);
        });
    }
    /**
     * List available projects (tenants)
     */
    listProjects(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield listProjects(this.client, opts);
        });
    }
    /**
     * List available service endpoints
     */
    listCatalog() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield listCatalog(this.client);
        });
    }
}
IdentityV3.type = 'identity';
//# sourceMappingURL=index.js.map