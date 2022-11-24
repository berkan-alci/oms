import HttpClient from '../../../core/http';
export interface KeyPair {
    readonly fingerprint: string;
    readonly name: string;
    readonly type?: string;
    readonly public_key: string;
}
export declare function listKeyPairs(client: HttpClient): Promise<KeyPair[]>;
