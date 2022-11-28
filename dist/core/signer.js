"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignHeaders = void 0;
const fast_sha256_1 = __importStar(require("fast-sha256"));
const cross_fetch_1 = require("cross-fetch");
const signAlgorithmHMACSHA256 = 'SDK-HMAC-SHA256';
const dateFormat = /-|:|\..{3}/g;
const encoder = new TextEncoder();
function getSignHeaders(credentials, request, date = new Date(), body = '') {
    let currentDate = date.toISOString().replace(dateFormat, '');
    if (!currentDate) {
        currentDate = new Date().toISOString().replace(dateFormat, '');
    }
    const newHeaders = new cross_fetch_1.Headers(request.headers);
    newHeaders.set('Host', request.url.host);
    newHeaders.append('X-Sdk-Date', currentDate);
    const stringifiedHeaders = sortedStringifiedHeaders(newHeaders);
    const signedHeaders = getSignedHeaders(stringifiedHeaders);
    const { queryString, yyyymmdd } = getQueryString({
        accessKeyId: credentials.accessKeyId,
        regionName: credentials.regionName,
        signedHeaders: signedHeaders,
        serviceName: request.serviceName,
        isoDate: currentDate,
    });
    const { canonicalRequest, additionalQueryString } = getCanonicalRequest({
        method: request.method,
        url: request.url,
        stringifiedHeaders: stringifiedHeaders,
        signedHeaders: signedHeaders,
        body: body,
    });
    const hash = (0, fast_sha256_1.default)(encoder.encode(canonicalRequest));
    const stringToSign = getStringToSign({
        iso8601: currentDate,
        yyyymmdd: yyyymmdd,
        regionName: credentials.regionName,
        serviceName: request.serviceName,
        hash: hash,
    });
    const signatureKey = getSigningKey({
        secretAccessKey: credentials.secretAccessKey,
        dateStamp: yyyymmdd,
        regionName: credentials.regionName,
        serviceName: request.serviceName,
    });
    const signature = getSignature(signatureKey, stringToSign);
    return {
        /* eslint-disable */
        'X-Sdk-Date': currentDate,
        'Authorization': `${queryString}${additionalQueryString} Signature=${signature}`,
        /* eslint-enable */
    };
}
exports.getSignHeaders = getSignHeaders;
/**
 * Stringify and sort http headers
 * @returns {Array<string>}
 */
function sortedStringifiedHeaders(headers) {
    const result = [];
    headers.forEach((v, k) => {
        result.push(`${k.toLowerCase()}:${v}`);
    });
    return result.sort();
}
/**
 * Get signed headers
 * @param stringifiedHeaders {Array<string>}
 * @returns {string}
 */
function getSignedHeaders(stringifiedHeaders) {
    let signedHeaders = '';
    for (const value of stringifiedHeaders) {
        signedHeaders += value.split(':')[0] + ';';
    }
    return signedHeaders.slice(0, -1);
}
/**
 * Get query string
 */
function getQueryString(params) {
    const yyyymmdd = params.isoDate.slice(0, 8);
    let queryString = signAlgorithmHMACSHA256;
    queryString += ` Credential=${params.accessKeyId}/${yyyymmdd}/${params.regionName}/${params.serviceName}/sdk_request,`;
    queryString += ` SignedHeaders=${params.signedHeaders},`;
    return { queryString, yyyymmdd };
}
/**
 * Get Canonical request.
 */
function getCanonicalRequest(params) {
    const bodyHash = (0, fast_sha256_1.default)(encoder.encode(params.body));
    if (!params.url.pathname) {
        params.url.pathname = '/';
    }
    if (!params.url.pathname.endsWith('/')) {
        params.url.pathname += '/';
    }
    if (!params.url.pathname.startsWith('/')) {
        params.url.pathname = '/' + params.url.pathname;
    }
    let canonicalRequest = `${params.method}\n${params.url.pathname}\n${params.url.searchParams.toString()}\n`;
    for (const value of params.stringifiedHeaders) {
        canonicalRequest += `${value}\n`;
    }
    canonicalRequest += `\n${params.signedHeaders}\n${Buffer.from(bodyHash).toString('hex')}`;
    return { canonicalRequest, additionalQueryString: '' };
}
function getStringToSign(params) {
    return `${signAlgorithmHMACSHA256}\n${params.iso8601}\n${params.yyyymmdd}/${params.regionName}/${params.serviceName}/sdk_request\n${Buffer.from(params.hash).toString('hex')}`;
}
function getSigningKey(params) {
    try {
        const kDate = (0, fast_sha256_1.hmac)(encoder.encode(`SDK${params.secretAccessKey}`), encoder.encode(params.dateStamp));
        const kRegion = (0, fast_sha256_1.hmac)(kDate, encoder.encode(params.regionName));
        const kService = (0, fast_sha256_1.hmac)(kRegion, encoder.encode(params.serviceName));
        return (0, fast_sha256_1.hmac)(kService, encoder.encode('sdk_request'));
    }
    catch (e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        throw new Error(`Failed to generate signature key: ${e.message}`);
    }
}
function getSignature(keyBuffer, stringToSign) {
    return Buffer.from((0, fast_sha256_1.hmac)(keyBuffer, encoder.encode(stringToSign))).toString('hex');
}
//# sourceMappingURL=signer.js.map