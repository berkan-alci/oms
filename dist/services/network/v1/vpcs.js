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
exports.getVPCStatus = exports.deleteVPC = exports.updateVPC = exports.createVPC = exports.listVPCs = exports.url = void 0;
const http_1 = require("../../../core/http");
const is_cidr_1 = __importDefault(require("is-cidr"));
exports.url = '/vpcs';
function listVPCs(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: exports.url });
        return resp.data.vpcs;
    });
}
exports.listVPCs = listVPCs;
function createVPC(client, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (opts.cidr && !(0, is_cidr_1.default)(opts.cidr)) {
            throw Error(`Invalid CIDR: ${opts.cidr}`);
        }
        const resp = yield client.post({ url: exports.url, json: { vpc: opts } });
        return resp.data.vpc;
    });
}
exports.createVPC = createVPC;
function updateVPC(client, vpcID, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.put({ url: (0, http_1.joinURL)(exports.url, vpcID), json: { vpc: opts } });
        return resp.data.vpc;
    });
}
exports.updateVPC = updateVPC;
function deleteVPC(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.delete({ url: (0, http_1.joinURL)(exports.url, vpcID) });
    });
}
exports.deleteVPC = deleteVPC;
function getVPCStatus(client, vpcID) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client.get({ url: (0, http_1.joinURL)(exports.url, vpcID) });
        return resp.data.vpc;
    });
}
exports.getVPCStatus = getVPCStatus;
//# sourceMappingURL=vpcs.js.map