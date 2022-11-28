"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContainer = exports.showContainerMetadata = exports.getContainer = exports.createContainer = void 0;
const http_1 = require("../../../../core/http");
const cross_fetch_1 = require("cross-fetch");
const url = '';
function createContainer(client, name, acl, metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new cross_fetch_1.Headers();
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
            url: (0, http_1.joinURL)(url, name),
            headers: headers,
        });
    });
}
exports.createContainer = createContainer;
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
function getContainer(client, name, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: (0, http_1.joinURL)(url, name), params: opts });
        return Object.assign(Object.assign({}, parseContainerHeaders(name, resp.headers)), resp.data);
    });
}
exports.getContainer = getContainer;
function showContainerMetadata(client, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.head({ url: (0, http_1.joinURL)(url, name) });
        return parseContainerHeaders(name, resp.headers);
    });
}
exports.showContainerMetadata = showContainerMetadata;
function deleteContainer(client, name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.delete({ url: (0, http_1.joinURL)(url, name) });
    });
}
exports.deleteContainer = deleteContainer;
//# sourceMappingURL=container.js.map