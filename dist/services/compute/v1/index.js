var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Service from '../../base';
import { listFlavors } from './flavors';
const groupInfoRe = /([\w-]+\d+)\((\w+)\)/;
const normal = 'normal';
/**
 * Compute v1 (ECS) service client
 */
export class ComputeV1 extends Service {
    constructor(url, client) {
        super(url, client);
    }
    /**
     * List all flavors available
     */
    listFlavors(az) {
        return __awaiter(this, void 0, void 0, function* () {
            const flavors = yield listFlavors(this.client, az);
            if (!az) {
                return flavors;
            }
            // AZ filtering is not working on server side, so still need to filter it
            return flavors.filter(f => {
                const azs = f.os_extra_specs['cond:operation:az'] || '';
                return azs.split(',').find(a => {
                    const items = a.match(groupInfoRe);
                    return (!!items) &&
                        (items.length === 3) &&
                        (items[1] === az) &&
                        (items[2] === normal);
                });
            });
        });
    }
}
ComputeV1.type = 'ecs';
//# sourceMappingURL=index.js.map