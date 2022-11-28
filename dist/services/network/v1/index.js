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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcV1 = void 0;
const base_1 = __importStar(require("../../base"));
const http_1 = require("../../../core/http");
const vpcs_1 = require("./vpcs");
const subnets_1 = require("./subnets");
const secgroups_1 = require("./secgroups");
const eips_1 = require("./eips");
/**
 * VPC v1 service client
 */
class VpcV1 extends base_1.default {
    constructor(url, client) {
        super(url, client);
    }
    /**
     * Get list of all existing VPCs
     */
    listVPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vpcs_1.listVPCs)(this.client);
        });
    }
    /**
     * Create new VPC
     * @param opts
     */
    createVPC(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = yield (0, vpcs_1.createVPC)(this.client, opts);
            let state = yield this.getVPC(id); // mutable state for waiting
            const statusOK = () => __awaiter(this, void 0, void 0, function* () {
                state = yield this.getVPC(id);
                return state.status === 'OK';
            });
            if (yield statusOK()) {
                return state;
            }
            yield (0, base_1.waitFor)(statusOK, 60);
            return state;
        });
    }
    /**
     * Get existing VPC details
     * @param vpcID
     */
    getVPC(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vpcs_1.getVPCStatus)(this.client, vpcID);
        });
    }
    /**
     * Update existing VPC
     * @param vpcID
     * @param opts
     */
    updateVPC(vpcID, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, vpcs_1.updateVPC)(this.client, vpcID, opts);
        });
    }
    /**
     * Delete existing VPC
     * @param vpcID
     */
    deleteVPC(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, vpcs_1.deleteVPC)(this.client, vpcID);
            }
            catch (e) {
                if (e instanceof http_1.HttpError && e.statusCode === 404) {
                    return;
                }
                throw e;
            }
            yield (0, base_1.waitForResourceToBeDeleted)(() => this.getVPC(vpcID), 60);
        });
    }
    /**
     * List existing subnets
     * @param vpcID
     */
    listSubnets(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, subnets_1.listSubnets)(this.client, vpcID);
        });
    }
    /**
     * Get existing subnet by ID
     * @param subnetID
     */
    getSubnet(subnetID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, subnets_1.getSubnetStatus)(this.client, subnetID);
        });
    }
    /**
     * Create new subnet with given opts
     * @param opts
     */
    createSubnet(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = yield (0, subnets_1.createSubnet)(this.client, opts);
            let state = yield this.getSubnet(id);
            const statusActive = () => __awaiter(this, void 0, void 0, function* () {
                state = yield this.getSubnet(id);
                return state.status === 'ACTIVE';
            });
            if (yield statusActive()) {
                return state;
            }
            yield (0, base_1.waitFor)(statusActive, 120);
            return state;
        });
    }
    /**
     * Delete existing subnet by ID
     * @param subnetID
     * @param vpcID - (optional) subnet`s VPC
     */
    deleteSubnet(subnetID, vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!vpcID) {
                const sn = yield this.getSubnet(subnetID);
                vpcID = sn.vpc_id;
            }
            yield (0, subnets_1.deleteSubnet)(this.client, vpcID, subnetID);
            yield (0, base_1.waitForResourceToBeDeleted)(() => this.getSubnet(subnetID), 120);
        });
    }
    /**
     * List existing security groups
     * @param opts
     */
    listSecurityGroups(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts) {
                opts = {};
            }
            return (0, secgroups_1.listSecurityGroups)(this.client, opts);
        });
    }
    /**
     * Create new security group
     * @param opts
     */
    createSecurityGroup(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, secgroups_1.createSecurityGroup)(this.client, opts);
        });
    }
    /**
     * Delete existing security group
     * @param id
     */
    deleteSecurityGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, secgroups_1.deleteSecurityGroup)(this.client, id);
        });
    }
    /**
     * List all public IPs assigned to the project
     */
    listPublicIPs() {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, eips_1.listPublicIPs)(this.client);
        });
    }
}
exports.VpcV1 = VpcV1;
VpcV1.type = 'vpc';
//# sourceMappingURL=index.js.map