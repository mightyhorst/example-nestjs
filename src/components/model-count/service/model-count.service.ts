import { Injectable } from '@nestjs/common';

/**
* ElasticSearch Provider 
**/
import { 
	ElasticSearchService, 
	ElasticSearchRequest, /*@todo - not used*/
	ElasticSearchResponse,
	buildQuery, IAggregation, IRange
} from '@services/services.module';

/**
* Highcharts Bar Chart  
**/
import { BarChartDto } from '@responses/index';

/**
* Error handling 
**/
import { ElasticSearchError } from '@errors/index';

/**
* @requires Types
**/
import { WarrantyTypes } from '@components/warranty/types';
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { FormFactorTypes } from '@components/form-factor/index';

/**
* 
* @class ModelCountService 
*
**/
@Injectable()
export class ModelCountService {

	private esIndex:string;

	constructor(private readonly elasticSearchService: ElasticSearchService){
		this.esIndex = 'ict_plus_device_data';
	}

	/**
	* 
	* @method search - elastic search for model count 
	* @todo error handling 
	* @param  {number} siteCode - school ID
	* @param  {FormFactorTypes} formFactor - formFactor filter
	* @param  {WarrantyTypes} warranty - warranty filter
	* @param  {AgeRanges} ageOfDevice - ageOfDevice filter 
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

		/**
		* @todo - add size to query 
		**/
		try{

			let esQuery = buildQuery(
				/** @param {number} siteCode **/     siteCode, 
				/** @param {IAggregation} agg **/    <IAggregation>{name: 'models', field: 'model'}, 
				/** @param {string} formFactor **/   formFactor, 
				/** @param {IRange} warranty **/     warranty,
				/** @param {IRange} ageOfDevice **/  ageOfDevice,
				/** @param {IRange} utilisation **/  utilisation,
				/** @param {string} model **/ 		 model,
				/** @param {number} size **/ 		 size
			);

			console.log('model-count.search.esQuery', {
				'esQuery': esQuery,
				'esQuery.query': esQuery.query, 
				'esQuery.aggs': esQuery.aggs,
				'esQuery.aggs.models.terms': esQuery.aggs.models.terms
			});

			return await this.elasticSearchService.query(this.esIndex, esQuery);

		}catch(err){
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
	* @param  {WarrantyTypes} warranty - warranty filter
	* @param  {AgeRanges} ageOfDevice - ageOfDevice filter 
	* @param  {UtilisationTypes} utilisation - utilisation filter 
	* @param  {string} model - utilisation filter 
	* @param  {number} size - limit the results returned. 
	* @returns {Promise<BarChartDto>} es response
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
	): Promise<BarChartDto[]>{

		/**
		* @todo - error handling
		**/
		try {

			let elasticSearchResponse = await this.search(
				siteCode, 
				formFactor,
				warranty,
				ageOfDevice,
				utilisation,
				model,
				size
			);

			let bucket, barChart;

			if(process.env.NODE_ENV != 'integration'){
				bucket = elasticSearchResponse.aggregations.models.buckets;

				barChart = bucket.map(item => {
					return new BarChartDto(item.key, item.doc_count)
				})
			}
			else{
				bucket = elasticSearchResponse.hits.hits;
				barChart = [];

				let modelsArray = bucket.map(item => {
					return item._source.model;
				});
				console.log('modelsArray', modelsArray);

				var modelTotals = {};
				for (var i = 0; i < modelsArray.length; i++) {
					let modelName = modelsArray[i];

					if(modelTotals[modelName]) modelTotals[modelName]++;
					else modelTotals[modelName] = 1;
				}
				console.log('modelTotals', modelTotals);

				for(let modelName in modelTotals){
					barChart.push(new BarChartDto(modelName, modelTotals[modelName]));
				}
			}

			console.log('barChart', barChart);
			
			return barChart;
		
		} catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}

	}
	
}
