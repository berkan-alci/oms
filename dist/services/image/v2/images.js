import { normalizeDateTime } from '../../../core';
import { Pager } from '../../base';
function rangeToString(range) {
    if (!range) {
        return range;
    }
    return `${range.operator}:${normalizeDateTime(range.date)}`;
}
function toQueryParams(opts) {
    if (!opts) {
        return undefined;
    }
    return {
        protected: opts.protected,
        visibility: opts.visibility,
        owner: opts.owner,
        id: opts.id,
        status: opts.status,
        container_format: opts.container_format,
        disk_format: opts.disk_format,
        min_ram: opts.min_ram,
        min_disk: opts.min_disk,
        tag: opts.tag,
        member_status: opts.member_status,
        /* eslint-disable */
        __os_type: opts.os_type,
        __os_bit: opts.os_bit,
        __platform: opts.platform,
        __support_kvm: opts.support_kvm,
        __support_xen: opts.support_xen,
        __support_largememory: opts.support_largememory,
        __support_diskintensive: opts.support_diskintensive,
        __support_highperformance: opts.support_highperformance,
        __support_xen_gpu_type: opts.support_xen_gpu_type,
        __support_kvm_gpu_type: opts.support_kvm_gpu_type,
        __support_xen_hana: opts.support_xen_hana,
        __support_kvm_infiniband: opts.support_kvm_infiniband,
        /* eslint-enable */
        created_at: rangeToString(opts.created_at),
        updated_at: rangeToString(opts.updated_at),
    };
}
export function listImages(client, opts) {
    const params = toQueryParams(opts);
    return new Pager({ url: '/v2/images', params: params }, client);
}
//# sourceMappingURL=images.js.map