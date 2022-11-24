export interface CredentialInfo {
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
    readonly regionName: string;
}
export interface RequestInfo {
    readonly method: string;
    readonly url: URL;
    readonly serviceName: string;
    readonly headers?: Headers;
}
export interface AuthHeaders {
    readonly 'X-Sdk-Date': string;
    readonly 'Authorization': string;
}
export declare function getSignHeaders(credentials: CredentialInfo, request: RequestInfo, date?: Date, body?: string): AuthHeaders;
