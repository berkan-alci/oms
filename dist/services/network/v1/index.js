var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Service, { waitFor, waitForResourceToBeDeleted } from '../../base';
import { HttpError } from '../../../core/http';
import { createVPC, deleteVPC, getVPCStatus, listVPCs, updateVPC, } from './vpcs';
import { createSubnet, deleteSubnet, getSubnetStatus, listSubnets, } from './subnets';
import { createSecurityGroup, deleteSecurityGroup, listSecurityGroups, } from './secgroups';
import { listPublicIPs } from './eips';
/**
 * VPC v1 service client
 */
export class VpcV1 extends Service {
    constructor(url, client) {
        super(url, client);
    }
    /**
     * Get list of all existing VPCs
     */
    listVPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield listVPCs(this.client);
        });
    }
    /**
     * Create new VPC
     * @param opts
     */
    createVPC(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = yield createVPC(this.client, opts);
            let state = yield this.getVPC(id); // mutable state for waiting
            const statusOK = () => __awaiter(this, void 0, void 0, function* () {
                state = yield this.getVPC(id);
                return state.status === 'OK';
            });
            if (yield statusOK()) {
                return state;
            }
            yield waitFor(statusOK, 60);
            return state;
        });
    }
    /**
     * Get existing VPC details
     * @param vpcID
     */
    getVPC(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getVPCStatus(this.client, vpcID);
        });
    }
    /**
     * Update existing VPC
     * @param vpcID
     * @param opts
     */
    updateVPC(vpcID, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield updateVPC(this.client, vpcID, opts);
        });
    }
    /**
     * Delete existing VPC
     * @param vpcID
     */
    deleteVPC(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield deleteVPC(this.client, vpcID);
            }
            catch (e) {
                if (e instanceof HttpError && e.statusCode === 404) {
                    return;
                }
                throw e;
            }
            yield waitForResourceToBeDeleted(() => this.getVPC(vpcID), 60);
        });
    }
    /**
     * List existing subnets
     * @param vpcID
     */
    listSubnets(vpcID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield listSubnets(this.client, vpcID);
        });
    }
    /**
     * Get existing subnet by ID
     * @param subnetID
     */
    getSubnet(subnetID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getSubnetStatus(this.client, subnetID);
        });
    }
    /**
     * Create new subnet with given opts
     * @param opts
     */
    createSubnet(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = yield createSubnet(this.client, opts);
            let state = yield this.getSubnet(id);
            const statusActive = () => __awaiter(this, void 0, void 0, function* () {
                state = yield this.getSubnet(id);
                return state.status === 'ACTIVE';
            });
            if (yield statusActive()) {
                return state;
            }
            yield waitFor(statusActive, 120);
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
            yield deleteSubnet(this.client, vpcID, subnetID);
            yield waitForResourceToBeDeleted(() => this.getSubnet(subnetID), 120);
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
            return listSecurityGroups(this.client, opts);
        });
    }
    /**
     * Create new security group
     * @param opts
     */
    createSecurityGroup(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return createSecurityGroup(this.client, opts);
        });
    }
    /**
     * Delete existing security group
     * @param id
     */
    deleteSecurityGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return deleteSecurityGroup(this.client, id);
        });
    }
    /**
     * List all public IPs assigned to the project
     */
    listPublicIPs() {
        return __awaiter(this, void 0, void 0, function* () {
            return listPublicIPs(this.client);
        });
    }
}
VpcV1.type = 'vpc';
//# sourceMappingURL=index.js.map