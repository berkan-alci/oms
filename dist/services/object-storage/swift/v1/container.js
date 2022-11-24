var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { joinURL } from '../../../../core/http';
import { Headers } from 'cross-fetch';
const url = '';
export function createContainer(client, name, acl, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new Headers();
        if (acl) {
            if (acl.read) {
                headers.append('X-ContainerMetadata-Read', acl.read);
            }
            if (acl.write) {
                headers.append('X-ContainerMetadata-Write', acl.write);
            }
        }
        if (metadata) {
            for (const [key, value] of Object.entries(metadata)) {
                headers.append(`X-Container-Meta-${key}`, value);
            }
        }
        yield client.put({
            url: joinURL(url, name),
            headers: headers,
        });
    });
}
const metadataPrefix = 'X-Container-Meta-'.toLowerCase();
function parseContainerHeaders(name, headers) {
    const metadata = {};
    let objectCount = 0;
    let bytesUsed = 0;
    let created = undefined;
    headers.forEach((v, k) => {
        if (k.startsWith(metadataPrefix)) {
            const mKey = k.replace(metadataPrefix, '');
            metadata[mKey] = v;
            return;
        }
        switch (k.toLowerCase()) {
            case 'x-container-object-count':
                objectCount = Number.parseInt(v);
                return;
            case 'x-container-bytes-used':
                bytesUsed = Number.parseInt(v);
                return;
            case 'x-timestamp':
                created = Number.parseFloat(v);
                return;
        }
    });
    return {
        bytes: bytesUsed,
        count: objectCount,
        created: created,
        name: name,
        metadata: metadata,
    };
}
export function getContainer(client, name, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: joinURL(url, name), params: opts });
        return Object.assign(Object.assign({}, parseContainerHeaders(name, resp.headers)), resp.data);
    });
}
export function showContainerMetadata(client, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.head({ url: joinURL(url, name) });
        return parseContainerHeaders(name, resp.headers);
    });
}
export function deleteContainer(client, name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.delete({ url: joinURL(url, name) });
    });
}
//# sourceMappingURL=container.js.map