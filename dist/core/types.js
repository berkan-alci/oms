"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDateTime = exports.cloud = void 0;
/**
 * CloudConfigHelper provides helper functions to get cloud configurations
 */
class CloudConfigHelper {
    constructor(authUrl) {
        this.config = { auth: { auth_url: authUrl } };
    }
    withRegion(region) {
        this.config.region = region;
        return this;
    }
    withProject(projectName) {
        this.config.auth.project_name = projectName;
        return this;
    }
    withPassword(domainName, username, password) {
        this.config.auth.domain_name = domainName;
        this.config.auth.username = username;
        this.config.auth.password = password;
        return this;
    }
    withToken(token) {
        this.config.auth.token = token;
        return this;
    }
    withAKSK(ak, sk) {
        this.config.auth.ak = ak;
        this.config.auth.sk = sk;
        return this;
    }
}
/**
 * Returns cloud configuration helper providing simple configuration
 * generation witch chained methods
 * @param authURL
 */
function cloud(authURL) {
    return new CloudConfigHelper(authURL);
}
exports.cloud = cloud;
const msRe = /(?<=\d{2})\.\d{3}(?=Z)/;
function normalizeDateTime(date) {
    if (!date) {
        return;
    }
    return new Date(date)
        .toISOString()
        .replace(msRe, '');
}
exports.normalizeDateTime = normalizeDateTime;
//# sourceMappingURL=types.js.map