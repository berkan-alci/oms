"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageV2 = void 0;
const base_1 = __importDefault(require("../../base"));
const images_1 = require("./images");
class ImageV2 extends base_1.default {
    constructor(url, httpClient) {
        super(url, httpClient);
    }
    listImages(opts) {
        return (0, images_1.listImages)(this.client, opts ? opts : {});
    }
}
exports.ImageV2 = ImageV2;
ImageV2.type = 'image';
//# sourceMappingURL=index.js.map