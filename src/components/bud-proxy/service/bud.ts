
export enum BUDMetricType {
    Inbound = 'inbound',
    Outbound = 'outbound',
}

export enum BUDNetworkType {
    WAN = 'wan',
    Internet = 'internet',
}

export interface IBUDLinks {
    self?: { href: string; };
    next?: { href: string; };
    last?: { href: string; };
}

export interface IBUDMeta {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
}

export interface IBUDSuccessResponse<TResult> {
    items: TResult[];
    _links: IBUDLinks;
    _meta: IBUDMeta;
}

export interface IBUDErrorResponse {
    // Error name
    name: string;

    // Error message
    message: string;

    // Unknown usage
    code: number;

    // HTTP Status Code
    status: number;
}

export type BUDResponse<TResult> = IBUDErrorResponse | IBUDSuccessResponse<TResult>;

export interface IMetric {
    time: string;
    value: number;
}
