import {Injectable, Logger} from '@nestjs/common';
import {InjectConfig} from 'nestjs-config';

/**
* @requires ElasticSearch Provider
**/
import {
	buildQuery, 
	ElasticSearchResponse, 
	ElasticSearchService, 
	IAggregation, 
	IRange
} from '@services/services.module';

/**
* @requires Highcharts Pie Chart
**/
import {
	BarChartDto, 
	PieChartDto
} from '@responses/index';

/**
* @requires Error handling
**/
import { ElasticSearchError } from '@errors/index';

/**
* @requires Types
**/
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { WarrantyTypes } from '@components/warranty/types';
import { FormFactorTypes } from '@components/form-factor/index';


/**
* 
* @class AgeService 
*
**/
@Injectable()
export class AgeService {

	private esIndex:string;

	constructor(
		@InjectConfig() private readonly config, 
		private readonly elasticSearchService: ElasticSearchService
	){
		this.esIndex = 'ict_plus_device_data';
	}

	
	/**
	* 
	* @method search - elastic search for age of device
	* @todo error handling 
	* @param  {number} siteCode - school ID
	* @param  {FormFactorTypes} formFactor - formFactor filter
	* @param  {WarrantyTypes} warranty - warranty filter
	* @param  {AgeRanges} ageOfDevice - filter based on age of device
	* @param  {UtilisationTypes} utilisation - utilisation filter 
	* @param  {string} model - model filter
	* @param  {number} size - limit the results returned. 
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async search(
		siteCode:number, 
		formFactor?:FormFactorTypes, 
		warranty?:WarrantyTypes,
		ageOfDevice?:AgeRanges,
		utilisation?:UtilisationTypes,
		model?:string,
		size?:number
	): Promise<ElasticSearchResponse>{

		try{
			/**
			* @todo - update Query 
			**/
			const ranges = [
				{ key: '1_year_old', from : "now-1y" },
				{ key: '2_years_old', from : "now-2y", to : "now-1y" },
				{ key: '3_years_old', from : "now-3y", to : "now-2y" },
				{ key: '4_years_old', from : "now-4y", to : "now-3y" },
				{ key: '5_plus_years_old', to : "now-4y" },
			];

			const esQuery = buildQuery(
				/** @param {number} siteCode **/     siteCode,
				/** @param {IAggregation} agg **/    <IAggregation>{name: 'ages', field: 'release_year', range: ranges },
				/** @param {FormFactorTypes} formFactor **/   formFactor,
				/** @param {IRange} warranty **/     warranty,
				/** @param {IRange} ageOfDevice **/  ageOfDevice,
				/** @param {IRange} utilisation **/  utilisation,
				/** @param {string} model **/ 		model,
				/** @param {number} size **/ 		size
			);
			
			const elasticSearchResponse = await this.elasticSearchService.query(this.esIndex, esQuery);
			return elasticSearchResponse;
		
		} catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}	
	}


	
	/**
	* 
	* @method searchToChart - chart data from elastic search
	* @todo error handling 
	* @param  {number} siteCode - school ID
	* @param  {FormFactorTypes} formFactor - formFactor filter
	* @param  {string} warranty - warranty filter
	* @param  {string} ageOfDevice - filter based on age of device
	* @param  {string} utilisation - utilisation filter 
	* @param  {string} model - model filter
	* @param  {number} size - limit the results returned. 
	* @returns {Promise<PieChartDto>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async searchToChart(
		siteCode:number, 
		formFactor?:FormFactorTypes, 
		warranty?:WarrantyTypes,
		ageOfDevice?:AgeRanges,
		utilisation?:UtilisationTypes,
		model?:string,
		size?:number
	): Promise<PieChartDto[]>{

		try{

			const elasticSearchResponse = await this.search(
			    siteCode,
			    formFactor,
			    warranty,
			    ageOfDevice,
			    utilisation,
			    model,
			    size,
			);

			const buckets = elasticSearchResponse.aggregations.ages.buckets;
			const pieChart = buckets.map((bucket) => {
				return new PieChartDto(bucket.key, bucket.doc_count);
			});

			return pieChart;

		}catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}
	}
}
