// {
//     "took": 0,
//     "timed_out": false,
//     "_shards": {
//     "total": 5,
//         "successful": 5,
//         "skipped": 0,
//         "failed": 0
// },
//     "hits": {
//     "total": 277,
//         "max_score": 0,
//         "hits": []
// }
// }

import {ApiModelProperty} from '@nestjs/swagger';
import {
    ElasticSearchHitsDto,
    ElasticSearchShardsStatusDto,
    IElasticSearchResponse
} from "@services/elastic-search/types";


export class DevicesCountDto implements IElasticSearchResponse<any> {
    _shards: ElasticSearchShardsStatusDto;
    hits: ElasticSearchHitsDto<any>;
    timed_out: boolean;
    took: number;
}
