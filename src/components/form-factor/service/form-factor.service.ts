import { Injectable } from '@nestjs/common';

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
* Highcharts Bar Chart  
**/
import { BarChartDto } from '@responses/index';

/**
* Error handling 
**/
import { ElasticSearchError } from '@errors/index';
import {WarrantyTypes} from "@components/warranty/types";
import {UtilisationTypes} from "@components/utilisation/types";
import {AgeRanges} from "@components/age/types";
import { FormFactorTypes } from '@components/form-factor/index';


/**
* 
* @class FormFactorService 
*
**/
@Injectable()
export class FormFactorService {

	private esIndex:string;

	constructor(private readonly elasticSearchService: ElasticSearchService){
		this.esIndex = 'ict_plus_device_data';
	}

	/**
	* 
	* @method search - elastic search for form factor 
	* @todo error handling 
	* @param  {number} 			 siteCode - school ID
	* @param  {FormFactorTypes}  formFactor - formFactor filter
	* @param  {WarrantyTypes} 	 warranty - warranty filter
	* @param  {AgeRanges} 		 age - age of device filter 
	* @param  {UtilisationTypes} utilisation - utilisation filter 
	* @param  {string} 			 model - model filter 
	* @param  {number} 			 size - limit the results returned. 
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async search(
		siteCode:number, 
		formFactor?: FormFactorTypes, 
		warranty?:WarrantyTypes,
		age?:AgeRanges,
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
				/** @param {IAggregation} agg **/    <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
				/** @param {string} formFactor **/   formFactor, 
				/** @param {IRange} warranty **/     warranty,
				/** @param {IRange} age **/ 		 age,
				/** @param {IRange} utilisation **/  utilisation,
				/** @param {string} model **/ 		 model,
				/** @param {number} size **/ 		 size
			);
	        
			var results = await this.elasticSearchService.query(this.esIndex, esQuery);
				results.esQuery = esQuery;
			return results;

		}catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}
	}


	/**
	* @method searchToChart - chart data from elastic search for form factor 
	* @todo error handling 
	* @param  {number} 			 siteCode - school ID
	* @param  {FormFactorTypes}  formFactor - formFactor filter
	* @param  {WarrantyTypes} 	 warranty - warranty filter
	* @param  {AgeRanges} 		 age - age of device filter 
	* @param  {UtilisationTypes} utilisation - utilisation filter 
	* @param  {string} 			 model - model filter 
	* @param  {number} 			 size - limit the results returned. 
	* @return {Promise<BarChartDto>} barChart - bar chart data
	* @throws {ElasticSearchError} error - elastic search error 
	*/
	async searchToChart(
		siteCode:number, 
		formFactor?: FormFactorTypes, 
		warranty?:WarrantyTypes,
		age?:AgeRanges,
		utilisation?:UtilisationTypes,
		model?:string,
		size?:number
	): Promise<BarChartDto[]>{

		try{
			let elasticSearchResponse = await this.search(
				siteCode, 
				formFactor,
				warranty, 
				age, 
				utilisation, 
				model, 
				size
			);
			let buckets = elasticSearchResponse.aggregations.form_factor_.buckets;
			let barChart = buckets.map((bucket) => {
				return new BarChartDto(bucket.key, bucket.doc_count);
			});

			return barChart;

		}catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}
	}

}
