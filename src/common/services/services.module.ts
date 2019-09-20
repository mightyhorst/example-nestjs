import { Module } from '@nestjs/common';

/**
* Services 
**/
import {ElasticSearchService} from './elastic-search/elastic-search.service';
export * from './elastic-search/bodybuilder.service';

/**
* DTO contracts 
**/
export {ElasticSearchService};
export {ElasticSearchRequest} from './elastic-search/dto/es-request';
export {ElasticSearchResponse} from './elastic-search/dto/es-response';

@Module({
	providers: [ElasticSearchService],
	// exports: [ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse]
	exports: [ElasticSearchService]
})
export class ServicesModule {}
