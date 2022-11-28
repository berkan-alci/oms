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
exports.deleteSecurityGroup = exports.createSecurityGroup = exports.listSecurityGroups = void 0;
const http_1 = require("../../../core/http");
const url = '/security-groups';
function listSecurityGroups(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: url, params: opts });
        return resp.data.security_groups;
    });
}
exports.listSecurityGroups = listSecurityGroups;
const sgNameRe = /^[\w\d.\-]{1,64}$/;
function createSecurityGroup(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!opts.name.match(sgNameRe)) {
            throw Error(`Invalid Security Group name: "${opts.name}".\nThe value should be a string of 1 to 64 characters that can contain letters, digits, underscores (_), hyphens (-), and periods (.).`);
        }
        const resp = yield client.post({ url: url, json: { security_group: opts } });
        return resp.data.security_group;
    });
}
exports.createSecurityGroup = createSecurityGroup;
function deleteSecurityGroup(client, id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.delete({ url: (0, http_1.joinURL)(url, id) });
    });
}
exports.deleteSecurityGroup = deleteSecurityGroup;
//# sourceMappingURL=secgroups.js.map