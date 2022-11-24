var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Headers } from 'cross-fetch';
const url = '';
const metadataPrefix = 'X-Account-Meta-'.toLowerCase();
const maxQuota = 9223372036854775807;
function parseAccountHeaders(headers) {
    const metadata = {};
    let bytesUsed = 0;
    let containerCount = 0;
    let objectCount = 0;
    let domainID = '';
    headers.forEach((v, k) => {
        if (k.startsWith(metadataPrefix)) {
            const mKey = k.replace(metadataPrefix, '');
            metadata[mKey] = v;
            return;
        }
        switch (k.toLowerCase()) {
            case 'x-account-object-count':
                objectCount = Number.parseInt(v);
                return;
            case 'x-account-container-count':
                containerCount = Number.parseInt(v);
                return;
            case 'x-account-bytes-used':
                bytesUsed = Number.parseInt(v);
                return;
            case 'x-account-project-domain-id':
                domainID = v;
                return;
        }
    });
    return {
        domainID: domainID,
        bytesUsed: bytesUsed,
        containerCount: containerCount,
        metadata: metadata,
        objectCount: objectCount,
    };
}
/**
 * Get account details and list containers
 */
export function getAccount(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: url, params: { format: 'json' } });
        const account = parseAccountHeaders(resp.headers);
        return Object.assign({ containers: resp.data }, account);
    });
}
/**
 * Update account metadata
 * @param client
 * @param metadata
 * @param quota - Configures the tenant quota. The value ranges from `0` to `9223372036854775807`.
 * After setting the quota, the quota will be checked each time you upload or copy an object,
 * or modify the metadata of an object or bucket. If set to -1, quota will be removed.
 */
export function updateAccountMetadata(client, metadata, quota) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers();
        if (metadata) {
            for (const [k, v] of Object.entries(metadata)) {
                headers.append(metadataPrefix + k, v);
            }
        }
        if (quota != null) {
            if (!Number.isInteger(quota) || quota > maxQuota) {
                throw Error(`Invalid quota value: ${quota}`);
            }
            if (quota < 0) {
                headers.append('X-Remove-AccountMetadata-Meta-Quota-Bytes', 'yes');
            }
            else {
                headers.append('X-AccountMetadata-Meta-Quota-Bytes', quota.toString());
            }
        }
        yield client.post({ url: url, headers: headers });
    });
}
export function showAccountMetadata(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.head({ url: url });
        return parseAccountHeaders(resp.headers);
    });
}
//# sourceMappingURL=accounts.js.map