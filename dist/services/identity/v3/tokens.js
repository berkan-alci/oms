var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = '/v3/auth/tokens';
function optsToRequestData(opts) {
    if (!opts.password) {
        throw 'Password has to be provided';
    }
    const auth = {
        identity: {
            methods: ['password'],
            password: {
                user: {
                    name: opts.username,
                    password: opts.password,
                    domain: {
                        name: opts.domain_name,
                        id: opts.domain_id,
                    },
                },
            },
        },
        scope: {},
    };
    if (opts.project_name || opts.project_id) {
        auth.scope = {
            project: {
                id: opts.project_id,
                name: opts.project_name,
            },
        };
    }
    else {
        auth.scope = {
            domain: {
                id: opts.domain_id,
                name: opts.domain_name,
            },
        };
    }
    return { auth: auth };
}
/**
 * Get permanent auth token
 * @param client - HTTP client to use
 * @param authOptions
 * @param nocatalog - not attach catalog to token
 */
export function createToken(client, authOptions, nocatalog) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = nocatalog ? { nocatalog: 'nocatalog' } : undefined;
        const data = optsToRequestData(authOptions);
        const resp = yield client
            .post({ url: url, json: data, params: params })
            .catch(e => {
            console.log(JSON.stringify(e));
            throw e;
        });
        const token = resp.data.token;
        const tokenID = resp.headers.get('X-Subject-Token');
        if (!tokenID) {
            throw 'No tokenID provided as X-Subject-Token';
        }
        return Object.assign({ id: tokenID }, token);
    });
}
/**
 * Verifying a Token
 * @param client
 * @param token - tokenID to be verified
 * @param nocatalog - not attach catalog to token
 */
export function verifyToken(client, token, nocatalog) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = nocatalog ? { nocatalog: 'nocatalog' } : undefined;
        const resp = yield client.get({
            url: url,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: { 'X-Subject-Token': token },
            params: params,
        });
        return Object.assign({ id: token }, resp.data.token);
    });
}
//# sourceMappingURL=tokens.js.map