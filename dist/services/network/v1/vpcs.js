var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { joinURL } from '../../../core/http';
import isCidr from 'is-cidr';
export const url = '/vpcs';
export function listVPCs(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: url });
        return resp.data.vpcs;
    });
}
export function createVPC(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.cidr && !isCidr(opts.cidr)) {
            throw Error(`Invalid CIDR: ${opts.cidr}`);
        }
        const resp = yield client.post({ url: url, json: { vpc: opts } });
        return resp.data.vpc;
    });
}
export function updateVPC(client, vpcID, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.put({ url: joinURL(url, vpcID), json: { vpc: opts } });
        return resp.data.vpc;
    });
}
export function deleteVPC(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.delete({ url: joinURL(url, vpcID) });
    });
}
export function getVPCStatus(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: joinURL(url, vpcID) });
        return resp.data.vpc;
    });
}
//# sourceMappingURL=vpcs.js.map