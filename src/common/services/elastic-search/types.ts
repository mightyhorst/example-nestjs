import {ApiModelProperty} from '@nestjs/swagger';


export interface IElasticSearchShardsStatus {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
}

export class ElasticSearchShardsStatusDto implements IElasticSearchShardsStatus {

    @ApiModelProperty({
        description: 'Number of failed shards',
        readOnly: true,
    })
    failed: number;

    @ApiModelProperty({
        description: 'Number of skipped shards',
        readOnly: true,
    })
    skipped: number;

    @ApiModelProperty({
        description: 'Number of successful shards',
        readOnly: true,
    })
    successful: number;

    @ApiModelProperty({
        description: 'Total number of shards',
        readOnly: true,
    })
    total: number;
}

export interface IElasticSearchHitSourceMetadata {
    _meta: {
        currentPage: number;
        totalCount: number;
        perPage: number;
        pageCount: number;
    };
}

export interface IElasticSearchHit<TSource> {
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: TSource;
}

export interface IElasticSearchHits<TSource> {
    total: number;
    max_score: number;
    hits: IElasticSearchHit<TSource & IElasticSearchHitSourceMetadata>[];
}

export class ElasticSearchHitsDto<TSource> implements IElasticSearchHits<TSource> {
    hits: IElasticSearchHit<TSource & IElasticSearchHitSourceMetadata>[];

    @ApiModelProperty({
        description: 'The maximum score allocated to any search result hit',
        readOnly: true,
    })
    max_score: number;

    @ApiModelProperty({
        description: 'Total number of hits',
        readOnly: true,
    })
    total: number;
}

export interface IElasticSearchAggregation {
    key: string;
    from?: any;
    to?: any;
    from_as_string?: string;
    to_as_string?: string;
    doc_count: number;
}


export interface IElasticSearchAggregations {
    [aggName: string]: IElasticSearchAggregation;
}

export interface IElasticSearchResponse<TSource> {
    took: number;
    timed_out: boolean;
    _shards: IElasticSearchShardsStatus;
    hits: IElasticSearchHits<TSource>;
    aggregations?: IElasticSearchAggregations;
}
