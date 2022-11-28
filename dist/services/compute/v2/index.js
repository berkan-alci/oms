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
exports.ComputeV2 = void 0;
const base_1 = __importDefault(require("../../base"));
const keypairs_1 = require("./keypairs");
/**
 * Compute v2 (Nova) service client
 */
class ComputeV2 extends base_1.default {
    constructor(url, client) {
        super(url, client);
    }
    listKeyPairs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, keypairs_1.listKeyPairs)(this.client);
        });
    }
}
exports.ComputeV2 = ComputeV2;
ComputeV2.type = 'compute';
//# sourceMappingURL=index.js.map