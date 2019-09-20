import { Injectable, Logger } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';

/**
* ElasticSearch Provider 
**/
import { 
	ElasticSearchService, 
	ElasticSearchRequest as EsReq, /*@todo - not used*/
	ElasticSearchResponse ,
	buildQuery, IAggregation, IRange
} from '@services/services.module';

/**
* Highcharts Pie Chart  and Types 
**/
import { PieChartDto } from '@responses/index';
import { buildEsQuery } from './index';
import { TimeRangeEnum } from '@enums/index';

/**
* Error handling 
**/
import { ElasticSearchError } from '@errors/index';



/**
* 
* @class TopWebsitesByHitsService 
*
**/
@Injectable()
export class TopWebsitesByHitsService {

	private esIndex:string;
	private maxSize:number;

	constructor(
		@InjectConfig() private readonly config, 
		private readonly elasticSearchService: ElasticSearchService
	){
		this.esIndex = 'ict_plus_fib_hourly_history';
		this.maxSize = this.config.get('elasticsearch').max_size;
	}

	/**
	* 
	* @method search - elastic search for form factor 
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} department - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async search(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<ElasticSearchResponse>{

		/**
		* @todo - add size to query 
		**/
		const sizer = size ? size : this.maxSize;

		try{

			let esQuery = buildEsQuery(
				siteCode,
				isDepartment,
				timeRange,
				size
			);
	        
			var results = await this.elasticSearchService.query(this.esIndex, esQuery);
				results.esQuery = esQuery;
			return results;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.log('[TopWebsitesByHitsService.search] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}


	/**
	* @method searchToChart - chart data from elastic search for form factor 
	* @todo error handling 
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} department - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @return {Promise<PieChartDto>} barChart - bar chart data
	* @throws {ElasticSearchError} error - elastic search error 
	*/
	async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{

		const sizer = size ? size : this.maxSize;

		try{
			const elasticSearchResponse = await this.search(
				siteCode,
				isDepartment,
				timeRange,
				sizer
			);
			const buckets = elasticSearchResponse.aggregations.Websites.buckets;
			const department = buckets['department'].total_hit_counts.value;
			const nonDepartment = buckets['non-department'].total_hit_counts.value;

			let barChart = [
				new PieChartDto('Department', department),
				new PieChartDto('Non-Department', nonDepartment)
			];

			return barChart;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.log('[TopWebsitesByHitsService.searchToChart] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}

}
