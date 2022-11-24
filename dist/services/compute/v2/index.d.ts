import Service from '../../base';
import HttpClient from '../../../core/http';
import { KeyPair } from './keypairs';
/**
 * Compute v2 (Nova) service client
 */
export declare class ComputeV2 extends Service {
    static readonly type: string;
    constructor(url: string, client: HttpClient);
    listKeyPairs(): Promise<KeyPair[]>;
}
