import Service, { Pager } from '../../base';
import { ImagePage, ListImageOpts } from './images';
import HttpClient from '../../../core/http';
export declare class ImageV2 extends Service {
    static readonly type = "image";
    constructor(url: string, httpClient: HttpClient);
    listImages(opts?: ListImageOpts): Pager<ImagePage>;
}
