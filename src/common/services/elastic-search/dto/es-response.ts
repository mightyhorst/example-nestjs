import { ElasticSearchRequest } from './es-request';

export interface IEsHit{
    _index: string;
    _type: string;
    _id: string;
    _score: number;
    _source: any;
    lastLoggedInDaysAgo?:any;
    shouldBeLabelledAs?:any;
    iAmCategorizedAsDept?:boolean
}

export interface ElasticSearchResponse {
    took: number;
    timed_out: boolean;
    _shards: {
        total: number;
        successful: number;
        skipped: number;
        failed: number;
    },
    hits: {
        total: number,
        max_score: number,
        // hits: any,
        hits: IEsHit[]
    },
    aggregations?: any,

    /**
    * @param {json} esQuery - add the esQuery back to the response to help with testing 
    * @todo implement ElasticSearchRequest and remove 'any'
    **/
    esQuery?: ElasticSearchRequest|any,

    /**
    * @param {json} counts - quick sums to help with testing
    * @todo remove 'any'
    **/
    counts?: any
}