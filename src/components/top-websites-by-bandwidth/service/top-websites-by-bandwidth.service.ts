import { Injectable, Logger } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';
import { log } from '@utils/index';

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
* Highcharts Pie Chart and Types 
**/
import { 
	PieChartDto as Pie, 
	BarChartDto as Bar
} from '@responses/index';
import { 
	buildEsQueryForPieChart,
	buildEsQueryForBarChart 
} from './index';
import { TimeRangeEnum } from '@enums/index';

/**
* Error handling 
**/
import { ElasticSearchError } from '@errors/index';

/**
* Cast to Boolean 
**/
const toBoolean = function (str) {
  switch (str) {
    case 'true':
    case '1':
    case 'on':
    case 'yes':
      return true
    default:
      return false
  }
}


/**
* 
* @class TopWebsitesByBandwidthService 
*
**/
@Injectable()
export class TopWebsitesByBandwidthService {

	private esIndex:string;
	private maxSize:number;

	constructor(
		@InjectConfig() private readonly config, 
		private readonly elasticSearchService: ElasticSearchService
	){
		this.esIndex = 'ict_plus_fib_hourly_history';
		this.maxSize = config.get('elasticsearch').max_size;
	}

	/**
	* 
	* @method search - elastic search for department and non department data
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} department - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async searchForPieChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<ElasticSearchResponse>{

		/**
		* @todo - add size to query 
		**/
		try{

			const sizer = size || this.maxSize;

			let esQuery = buildEsQueryForPieChart(
				siteCode, 
				isDepartment,
				timeRange,
				sizer
			);
			      
			var results = await this.elasticSearchService.query(this.esIndex, esQuery);
				results.esQuery = esQuery;
			return results;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.debug('[TopWebsitesByBandwidthService.search] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}




	/**
	* 
	* @method search - elastic search for department and non department data
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} department - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @returns {Promise<ElasticSearchResponse>} es response
	* @throws {ElasticSearchError} error - elastic search error  
	*/
	async searchForBarChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<ElasticSearchResponse>{

		/**
		* @todo - add size to query 
		**/
		try{

			const sizer = size || this.maxSize;

			let esQuery = buildEsQueryForBarChart(
				siteCode, 
				isDepartment,
				timeRange,
				sizer
			);
			      
			var results = await this.elasticSearchService.query(this.esIndex, esQuery);
				results.esQuery = esQuery;
			return results;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.debug('[TopWebsitesByBandwidthService.search] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}




	/**
	* @method searchToPieChart - pie chart data from elastic search showing dept and non dept data 
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} department - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @return {Promise<Pie>} barChart - bar chart data
	* @throws {ElasticSearchError} error - elastic search error 
	*/
	async pieChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<Pie[]>{

		let iAmLookingForDepartments:boolean;
		try{
			iAmLookingForDepartments = toBoolean(isDepartment);
		}
		catch(err){
			throw err;
		}

		try{
			const sizer = size || 0;

			const elasticSearchResponse = await this.searchForPieChart(
				siteCode,
				iAmLookingForDepartments,
				timeRange,
				sizer
			);
			const buckets = elasticSearchResponse.aggregations.Websites.buckets;
			const department = buckets['department'].total_hit_counts.value;
			const nonDepartment = buckets['non-department'].total_hit_counts.value;

			let pieChart = [
				new Pie('Department', department),
				new Pie('Non-Department', nonDepartment)
			];

			return pieChart;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.debug('[TopWebsitesByBandwidthService.searchToChart] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}

	/**
	* @method searchToBarChart - bar chart data from elastic search showing dept and non dept data 
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} isDepartment - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @return {Promise<Bar>} barChart - bar chart data
	* @throws {ElasticSearchError} error - elastic search error 
	*/
	async barChart(
		siteCode:number, 
		isDepartment: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<Bar[]>{
		
		let iAmLookingForDepartments:boolean;
		try{
			iAmLookingForDepartments = toBoolean(isDepartment);
		}
		catch(err){
			throw err;
		}
		

		try{
			const sizer = size || this.maxSize;

			let barChart: Bar[];

			const elasticSearchResponse = await this.searchForBarChart(
				siteCode,
				iAmLookingForDepartments,
				timeRange,
				sizer
			);

			
			barChart = elasticSearchResponse.hits.hits.map(row => {
				console.log('row --->', row);
				return new Bar(row._source.sitehost, row._source.total_bytes_received);
			})

			return barChart;
			

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.debug('[TopWebsitesByBandwidthService.searchToBarChart] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}


	/**
	* @method searchToBarChart - bar chart data from elastic search showing dept and non dept data 
	* @param {params.sitecode} 	sitecode - school ID
	* @param {query.department} isDepartment - filter based on department
	* @param {query.timerange} 	timeRange - filter based on timeRange
	* @param {query.size} 		size - limit the size of the results
	* @return {Promise<Bar>} barChart - bar chart data
	* @throws {ElasticSearchError} error - elastic search error 
	*/
	async searchToBarChartByCalc(
		siteCode:number, 
		isDepartment: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<Bar[]>{
		
		let iAmLookingForDepartments:boolean;
		try{
			iAmLookingForDepartments = toBoolean(isDepartment);
		}
		catch(err){
			throw err;
		}
		

		try{
			const sizer = size || this.maxSize;

			const elasticSearchResponse = await this.searchForBarChart(
				siteCode,
				iAmLookingForDepartments,
				timeRange,
				sizer
			);
			var buckets = elasticSearchResponse.hits.hits.sort((a,b)=>{
				if ( a._source['total_bytes_sent'] < b._source['total_bytes_sent'] ){
					return 1;
				}
				if ( a._source['total_bytes_sent'] > b._source['total_bytes_sent'] ){
					return -1;
				}
				return 0;

			});

			/**
			* categorize department 
			*/
			buckets = buckets.map(row => {

				let site = row._source.sitehost;
				
				let isDept;

				if(site.indexOf('microsoft') >= 0){
					isDept = true;
				}
				else if(site.indexOf('det.nsw.edu.au') >= 0){
					isDept = true;
				}
				else if(site.indexOf('sentral.com.au') >= 0){
					isDept = true;
				}
				else if(site.indexOf('google') >= 0){
					isDept = true;
				}
				else if(site.indexOf('apple') >= 0){
					isDept = true;
				}
				else{
					isDept = false;
				}
				console.log('site--->', {
					'site': site,
					"site.indexOf('microsoft')": site.indexOf('microsoft'),
					"site.indexOf('det.nsw.edu.au')": site.indexOf('det.nsw.edu.au'),
					"site.indexOf('sentral.com.au')": site.indexOf('sentral.com.au'),
					"site.indexOf('google')": site.indexOf('google'),
					"site.indexOf('apple')": site.indexOf('apple'),
					'param.iAmLookingForDepartments': iAmLookingForDepartments,
					'iAmCategorizedAsDept': isDept,
				});

				let item = {
					...row._source,
					iAmCategorizedAsDept: isDept
				}

				return item;
			});

			/**
			* filtering 
			* if you're looking for iAmLookingForDepartments: return isDept
			* if you're not looking for iAmLookingForDepartments: return isNotDept
			*/
			const departmentData = buckets.filter(row => {
				return row.iAmCategorizedAsDept;	
			});
			const nonDepartmentData = buckets.filter(row => {
				return !row.iAmCategorizedAsDept;
			});

			console.log({
				departmentData: departmentData,
				nonDepartmentData: nonDepartmentData,
				iAmLookingForDepartments: iAmLookingForDepartments, 
				whichDatasetWillIInclude: (iAmLookingForDepartments ? 'departmentData' : 'nonDepartmentData')
			});

			const selectedData = (iAmLookingForDepartments ? departmentData : nonDepartmentData);
				
			const barCharts = selectedData.map(row => {
				return new Bar(row['sitehost'], row['total_bytes_sent']);
			});
			return barCharts;

		}catch(err){
			if(err instanceof ElasticSearchError){
				console.debug('[TopWebsitesByBandwidthService.searchToBarChart] ElasticSearchError:', err);
				/**@todo extra processing **/
			}
			throw err;
		}
	}
}
