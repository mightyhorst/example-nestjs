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
* Types
**/
import { WarrantyTypes } from '@components/warranty/types';
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { FormFactorTypes } from '@components/form-factor/index';


/**
* 
* @class UtilisationService 
*
**/
@Injectable()
export class UtilisationService {

	private esIndex:string;

	constructor(private readonly elasticSearchService: ElasticSearchService){
		this.esIndex = 'ict_plus_device_data';
	}

	/**
	* 
	* @method search - elastic search for age of device
	* @todo error handling 
	* @param {number} siteCode - school ID
	* @param {FormFactorTypes} formFactor - formFactor filter
	* @param {WarrantyTypes} warranty - warranty filter
	* @param {AgeRanges} ageOfDevice - ageOfDevice filter 
	* @param {UtilisationTypes} utilisation - utilisation filter
	* @param {string} model - model filter
	* @param {number} size - limit the results returned. 
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async search(
		siteCode:number, 
		formFactor?:FormFactorTypes, 
		warranty?:WarrantyTypes,
		ageOfDevice?:AgeRanges,
		utilisation?: UtilisationTypes,
		model?:string, 
		size?:number
	): Promise<ElasticSearchResponse>{

		/**
		* @todo - add size to query 
		**/
		try{
			let ranges = [
				/**
				* past 7 days 
				**/
				{ from : "now-7d", to: "now" },

				/**
				* between 7 and 15 days  
				**/
				{ from : "now-15d", to : "now-7d-1m" },

				/**
				* between 15 and 30 days
				**/
				{ from : "now-30d", to : "now-15d-1m" },

				/**
				* Over 30 days plus old 
				**/
				{ to: "now-30d-1m" }

			];

			let esQuery = buildQuery(
				/** @param {number} siteCode **/     siteCode, 
				/** @param {IAggregation} agg **/    <IAggregation>{name: 'utilisation_ranges', field: 'last_logon_timestamp0', range: ranges}, 
				/** @param {string} formFactor **/   formFactor, 
				/** @param {IRange} warranty **/     warranty,
				/** @param {IRange} ageOfDevice **/  ageOfDevice,
				/** @param {IRange} utilisation **/  utilisation, //<IRange>{"gt" : "now-15d", "lte" :  "now-7d"}, 
				/** @param {string} model **/ 		 model,
				/** @param {number} size **/ 		 size
			);
		    
			var results:ElasticSearchResponse = await this.elasticSearchService.query(this.esIndex, esQuery);

			/**
			* Adding human readbale difference in days to help with tests 
			* @todo - add MomentJs for easy date manipulation
			**/
			var utilisedInPast7days = 0,
				utilisedIn7to15days = 0,
				utilisedIn15to30days = 0,
				utilisedOver30days = 0;


			results.hits.hits = results.hits.hits.map((item)=>{

				let lastLogin = new Date(item._source.last_logon_timestamp0);
				let today = new Date();
				let timeDiff = Math.abs(today.getTime() - lastLogin.getTime());
				let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				item.lastLoggedInDaysAgo = diffDays;

				if(diffDays <= 7) {
					item.shouldBeLabelledAs = 'Utilised in past 7 days';
					utilisedInPast7days++;
				}
				else if(diffDays > 7 && diffDays <= 15) {
					item.shouldBeLabelledAs = 'Utilised in 7 to 15 days';
					utilisedIn7to15days++;
				}
				else if(diffDays > 15 && diffDays <= 30) {
					item.shouldBeLabelledAs = 'Utilised in 15 to 30 days';
					utilisedIn15to30days++;
				}
				else if(diffDays > 30) {
					item.shouldBeLabelledAs = 'Utilised over 30 days';
					utilisedOver30days++;
				}

				return item;
			})
			
			let total:number = utilisedInPast7days + utilisedIn7to15days + utilisedIn15to30days + utilisedOver30days;
			results.counts = {
				utilisedInPast7days: utilisedInPast7days,
				utilisedIn7to15days: utilisedIn7to15days,
				utilisedIn15to30days: utilisedIn15to30days,
				utilisedOver30days: utilisedOver30days,
				total: total,
				matches: total === Number(results.hits.total)
			} 

			/**
			* Adding query to help with testing
			**/
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
	* 
	* @method searchToChart - chart data from elastic search
	* @todo error handling 
	* @param {number} siteCode - school ID
	* @param {FormFactorTypes} formFactor - formFactor filter
	* @param {WarrantyTypes} warranty - warranty filter
	* @param {AgeRanges} ageOfDevice - ageOfDevice filter 
	* @param {UtilisationTypes} utilisation - utilisation filter
	* @param {string} model - model filter
	* @param {number} size - limit the results returned. 
	* @returns {Promise<BarChartDto>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async searchToChart(
		siteCode:number, 
		formFactor?:FormFactorTypes, 
		warranty?:WarrantyTypes,
		ageOfDevice?:AgeRanges,
		utilisation?: UtilisationTypes,
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

			let bucket = elasticSearchResponse.aggregations.utilisation_ranges.buckets;
			let chartData = bucket
				.map((item, index) => {
					
					switch (index) {
						/*
						case 0:
							return new BarChartDto('Utilised in past 7 days', item.doc_count);

						case 1:
							return new BarChartDto('Utilised in 7 to 15 days', item.doc_count);

						case 2:
							return new BarChartDto('Utilised in 15 to 30 days', item.doc_count);

						case 3:
							return new BarChartDto('Utilised over 30 days', item.doc_count);
						*/
						/**
						* @todo - check whether this grouping is correct 
						**/
						case 3:
							return new BarChartDto('Utilised in past 7 days', item.doc_count);

						case 2:
							return new BarChartDto('Utilised in 7 to 15 days', item.doc_count);

						case 1:
							return new BarChartDto('Utilised in 15 to 30 days', item.doc_count);

						case 0:
							return new BarChartDto('Utilised over 30 days', item.doc_count);

						default:
							console.log('There was an error ', {item: item, index: index});
							break;
					}
				})
			
			return chartData;
		
		} catch(err){
			if(err instanceof ElasticSearchError){
				/**@todo extra processing **/
			}
			throw err;
		}

	}

}
