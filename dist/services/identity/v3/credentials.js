var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = '/v3.0/OS-CREDENTIAL/credentials';
/**
 * Create permanent AK/SK
 */
export function createCredential(client, userID, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { user_id: userID, description: description };
        const resp = yield client.post({ url: url, json: data });
        if (!resp.ok) {
            throw 'Failed to create AK/SK';
        }
        return resp.data;
    });
}
//# sourceMappingURL=credentials.js.map