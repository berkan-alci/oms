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
import { url as vpcURL } from './vpcs';
const url = '/subnets';
export function listSubnets(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        let params = {};
        if (vpcID) {
            params = { vpc_id: vpcID };
        }
        const resp = yield client.get({ url: url, params: params });
        return resp.data.subnets;
    });
}
export function createSubnet(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.cidr && !isCidr(opts.cidr)) {
            throw Error(`Invalid CIDR: ${opts.cidr}`);
        }
        const resp = yield client.post({ url: url, json: { subnet: opts } });
        return resp.data.subnet;
    });
}
export function getSubnetStatus(client, subnetID) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: joinURL(url, subnetID) });
        return resp.data.subnet;
    });
}
export function deleteSubnet(client, vpcID, subnetID) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteURL = joinURL(vpcURL, vpcID, url, subnetID);
        yield client.delete({ url: deleteURL });
    });
}
//# sourceMappingURL=subnets.js.map