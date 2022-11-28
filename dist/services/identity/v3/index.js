"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityV3 = void 0;
const base_1 = __importDefault(require("../../base"));
const tokens_1 = require("./tokens");
const credentials_1 = require("./credentials");
const projects_1 = require("./projects");
const catalog_1 = require("./catalog");
__exportStar(require("./tokens"), exports);
__exportStar(require("./endpoints"), exports);
__exportStar(require("./credentials"), exports);
__exportStar(require("./services"), exports);
class IdentityV3 extends base_1.default {
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
            return yield (0, tokens_1.createToken)(this.client, credentials, noCatalog);
        });
    }
    /**
     * Get existing token information
     */
    verifyToken(tokenID, noCatalog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, tokens_1.verifyToken)(this.client, tokenID, noCatalog);
        });
    }
    /**
     * Create permanent AK/SK
     * @param userID
     * @param description
     */
    getAKSK(userID, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, credentials_1.createCredential)(this.client, userID, description);
        });
    }
    /**
     * List available projects (tenants)
     */
    listProjects(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, projects_1.listProjects)(this.client, opts);
        });
    }
    /**
     * List available service endpoints
     */
    listCatalog() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, catalog_1.listCatalog)(this.client);
        });
    }
}
exports.IdentityV3 = IdentityV3;
IdentityV3.type = 'identity';
//# sourceMappingURL=index.js.map