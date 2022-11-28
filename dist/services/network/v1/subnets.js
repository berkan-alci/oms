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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubnet = exports.getSubnetStatus = exports.createSubnet = exports.listSubnets = void 0;
const http_1 = require("../../../core/http");
const is_cidr_1 = __importDefault(require("is-cidr"));
const vpcs_1 = require("./vpcs");
const url = '/subnets';
function listSubnets(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        let params = {};
        if (vpcID) {
            params = { vpc_id: vpcID };
        }
        const resp = yield client.get({ url: url, params: params });
        return resp.data.subnets;
    });
}
exports.listSubnets = listSubnets;
function createSubnet(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.cidr && !(0, is_cidr_1.default)(opts.cidr)) {
            throw Error(`Invalid CIDR: ${opts.cidr}`);
        }
        const resp = yield client.post({ url: url, json: { subnet: opts } });
        return resp.data.subnet;
    });
}
exports.createSubnet = createSubnet;
function getSubnetStatus(client, subnetID) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: (0, http_1.joinURL)(url, subnetID) });
        return resp.data.subnet;
    });
}
exports.getSubnetStatus = getSubnetStatus;
function deleteSubnet(client, vpcID, subnetID) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteURL = (0, http_1.joinURL)(vpcs_1.url, vpcID, url, subnetID);
        yield client.delete({ url: deleteURL });
    });
}
exports.deleteSubnet = deleteSubnet;
//# sourceMappingURL=subnets.js.map