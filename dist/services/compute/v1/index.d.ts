import Service from '../../base';
import HttpClient from '../../../core/http';
import { Flavor } from './flavors';
/**
 * Compute v1 (ECS) service client
 */
export declare class ComputeV1 extends Service {
    static readonly type: string;
    constructor(url: string, client: HttpClient);
    /**
     * List all flavors available
     */
    listFlavors(az?: string): Promise<Flavor[]>;
}
