import Service from '../../base';
import { listImages } from './images';
export class ImageV2 extends Service {
    constructor(url, httpClient) {
        super(url, httpClient);
    }
    listImages(opts) {
        return listImages(this.client, opts ? opts : {});
    }
}
ImageV2.type = 'image';
//# sourceMappingURL=index.js.map