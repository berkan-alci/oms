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
exports.SwiftV1 = void 0;
const base_1 = __importDefault(require("../../../base"));
const container_1 = require("./container");
const accounts_1 = require("./accounts");
class SwiftV1 extends base_1.default {
    constructor(url, client) {
        super(url, client);
    }
    /**
     * Get AccountMetadata details and container list
     */
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, accounts_1.getAccount)(this.client);
        });
    }
    /**
     * Get AccountMetadata details
     */
    showAccountMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, accounts_1.showAccountMetadata)(this.client);
        });
    }
    /**
     * Update account metadata
     * @param metadata
     * @param quota - Configures the tenant quota. The value ranges from `0` to `9223372036854775807`.
     * After setting the quota, the quota will be checked each time you upload or copy an object,
     * or modify the metadata of an object or bucket. If set to -1, quota will be removed.
     */
    updateAccountMetadata(metadata, quota) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, accounts_1.updateAccountMetadata)(this.client, metadata, quota);
        });
    }
    createContainer(name, acls, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, container_1.createContainer)(this.client, name, acls, metadata);
        });
    }
    listContainers() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAccount()).containers;
        });
    }
    showContainerMetadata(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, container_1.showContainerMetadata)(this.client, name);
        });
    }
    getContainer(name, objectListOpts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, container_1.getContainer)(this.client, name, objectListOpts);
        });
    }
    deleteContainer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, container_1.deleteContainer)(this.client, name);
        });
    }
}
exports.SwiftV1 = SwiftV1;
SwiftV1.type = 'object-store';
//# sourceMappingURL=index.js.map