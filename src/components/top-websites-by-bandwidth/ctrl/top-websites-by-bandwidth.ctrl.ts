/**
* @import Swagger 
**/
import { 
	ApiUseTags, 
	ApiBearerAuth, 
	ApiImplicitParam, 
	ApiImplicitQuery, 
	ApiOperation, 
	ApiResponse, 
	ApiOkResponse, 
	/** ApiUnauthorizedResponse, ** not released yet **/
	ApiForbiddenResponse,
	ApiUnprocessableEntityResponse,
	ApiInternalServerErrorResponse,
	ApiServiceUnavailableResponse,
	ApiRequestTimeoutResponse
} from '@nestjs/swagger';

/**
* @import Endpoint
**/
import {
	Controller,
	Get,
	Query,
	Param, 
	UseGuards,
	Res,
	Header
} from '@nestjs/common';
import { Response } from 'express';

/**
* @import Services 
**/
import { TopWebsitesByBandwidthService } from '../service/top-websites-by-bandwidth.service';

/**
* @import Responses 
**/
import { 
	TopWebsitesByBandwidthResponseDto as ResDto, 
	// TopWebsitesByBandwidthErrorResponseDto as ErrDto, 
	TopWebsitesByBandwidthPieChartResponseDto  as PieChartResp,
	TopWebsitesByBandwidthBarChartResponseDto  as BarChartResp,
} from '../dto/index';
/*import { 
	PieChartDto as Pie,
	BarChartDto as Bar
} from '@responses/charts/index';*/
import { 
	AuthErrorResponseDto as AuthErrorRes,
	ValidationErrorResponseDto as ValidErrorRes,
	IntegrationErrorResponseDto as PlatErrorRes,
	ServerErrorResponseDto as ServerErrorRes,
	ErrorResponseDto as ErrRes
} from '@responses/index';

/**
* @import Middleware & Utils
**/
import {
	errorHandling
} from '@middleware/index'
import {
	validateSiteCode
} from '@utils/index'
import { TimeRangeEnum } from '@enums/index';

/**
* @import Errors 
**/
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, 
	IntegrationError, 
	AuthError 
} from '@errors/index';
import {AuthGuard} from '@nestjs/passport';
import {WarrantyTypes} from "@components/warranty/types";


/**
*
* @class TopWebsitesByBandwidthController  
*
**/
@ApiUseTags('top-websites-by-bandwidth')
@ApiBearerAuth()
@Controller('api/v2/top-websites-by-bandwidth')
export class TopWebsitesByBandwidthController {

	constructor(private readonly topWebsitesByBandwidthService: TopWebsitesByBandwidthService){

	}

	/**
	* @name get es query 
	* @description GET /api/v2/top-websites-by-bandwidth/{sitecode}
	* @description Directly query Elastic Search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.department} 	department - filter based on department
	* @param 	{query.timerange} 	timeRange - filter based on timeRange
	* @param 	{query.size} 		size - limit the size of the results
	* @param 	{query.charttype}   chartType - swicth between bar and pie chart results 
	* @returns 	{ResDto} Response data 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/  
	@Get(':sitecode')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ title: 'Directly query Elastic Search' })
	@ApiImplicitParam({
        name:		 'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required: 	 true, 
        type: 		 'number'
	})
	/**
	* @name Query  
	**/
	@ApiImplicitQuery({
        name:		 'isdepartment', 
        description: '(Optional) Department or NonDepartment - filter based on department', 
        required: 	 false, 
        type: 		 'boolean',
        enum: 		 ['true', 'false']
	})
	@ApiImplicitQuery({
        name:		 'timerange', 
        description: '(Optional) timerange - filter based on timerange', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['today', 'yesterday', 'thisweek', 'thismonth']
	})
	@ApiImplicitQuery({
        name:		 'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required: 	 false, 
        type: 		 'number'
	})
	@ApiImplicitQuery({
        name:		 'charttype', 
        description: '(Optional) charttype - switch between bar or pie chart', 
        required: 	 true, 
        type: 		 'string',
        enum: 		 ['pie', 'bar']
	})
	/**
	* @name Responses 
	**/
	@ApiOkResponse({ 
		description: 'The response from elastic search.',
		type: ResDto
	})
	@ApiResponse({ 
		/* @ApiUnauthorizedResponse ** not released yet **/
		status: 401, 
		description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
		type: AuthErrorRes
	})
	@ApiForbiddenResponse({ 
		description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
		type: AuthErrorRes
	})
	@ApiUnprocessableEntityResponse({ 
		description: 'Validation Error - A list of the validation and/or business rules violated',
		type: ValidErrorRes
	})	
	@ApiServiceUnavailableResponse({ 
		description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiRequestTimeoutResponse({ 
		description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiInternalServerErrorResponse({ 
		description: 'Server Error - A runtime error to be fixed by developer',
		type: ServerErrorRes
	})
	@UseGuards(AuthGuard('jwt'))
	async search(
		@Param('sitecode') siteCode, 
		@Query('isdepartment') isDepartment?: boolean, 
		@Query('timerange') timeRange?: TimeRangeEnum, 
		@Query('charttype') chartType?: string, 
		@Query('size') size?,
	): Promise<ResDto|ErrRes> {
		
		try{

			const validSiteCode = validateSiteCode(siteCode);
			let searchResults;

			if(chartType === 'pie'){
				searchResults = await this.topWebsitesByBandwidthService.searchForPieChart(
					siteCode, 
					isDepartment,
					timeRange,
					size
				);
			}
			else if(chartType === 'bar'){
				searchResults = await this.topWebsitesByBandwidthService.searchForBarChart(
					siteCode, 
					isDepartment,
					timeRange,
					size
				);
			}
			else{
				throw new ValidationError('chart type must be either "bar" or "chart"');
			}
			return Promise.resolve(new ResDto(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}



	/**
	* @name get pie chart data 
	* @description GET /api/v2/top-websites-by-bandwidth/{sitecode}/piechart
	* @description PieChart data from elastic search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.department} 	department - filter based on department
	* @param 	{query.timerange} 	timeRange - filter based on timeRange
	* @param 	{query.size} 		size - limit the size of the results
	* @returns 	{PieChartResp} pie chart response 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/ 
	@Get(':sitecode/piechart')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ title: 'Chart data from elastic search' })
	@ApiImplicitParam({
        name:		 'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required: 	 true, 
        type: 		 'number'
	})
	/**
	* @name Query  
	**/
	@ApiImplicitQuery({
        name:		 'isdepartment', 
        description: '(Optional) Department or NonDepartment - filter based on department', 
        required: 	 false, 
        type: 		 'boolean',
        enum: 		 ['true', 'false']
	})
	@ApiImplicitQuery({
        name:		 'timerange', 
        description: '(Optional) timerange - filter based on timerange', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['today', 'yesterday', 'thisweek', 'thismonth']
	})
	@ApiImplicitQuery({
        name:		 'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required: 	 false, 
        type: 		 'number'
	})
	/**
	* @name Responses 
	**/
	@ApiOkResponse({ 
		// status: 200, 
		description: 'The response for elastic chart series.data field',
		type: PieChartResp
	})
	@ApiResponse({ 
		/* @ApiUnauthorizedResponse ** not released yet **/
		status: 401, 
		description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
		type: AuthErrorRes
	})
	@ApiForbiddenResponse({ 
		description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
		type: AuthErrorRes
	})
	@ApiUnprocessableEntityResponse({ 
		description: 'Validation Error - A list of the validation and/or business rules violated',
		type: ValidErrorRes
	})	
	@ApiServiceUnavailableResponse({ 
		description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiRequestTimeoutResponse({ 
		description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiInternalServerErrorResponse({ 
		description: 'Server Error - A runtime error to be fixed by developer',
		type: ServerErrorRes
	})
	@UseGuards(AuthGuard('jwt'))
	async pieChart(
		@Param('sitecode') siteCode, 
		@Query('isdepartment') isDepartment?: boolean, 
		@Query('timerange') timeRange?: TimeRangeEnum, 
		@Query('size') size?,
	): Promise<PieChartResp|ErrRes> {

		try{
			const validSiteCode = validateSiteCode(siteCode);
			
			let searchResults = await this.topWebsitesByBandwidthService.pieChart(
				validSiteCode, 
				isDepartment,
				timeRange,
				size
			);
			return Promise.resolve(new PieChartResp(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}

	/**
	* @name get bar chart data 
	* @description GET /api/v2/top-websites-by-bandwidth/{sitecode}/piechart
	* @description BarChart data from elastic search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.department} 	department - filter based on department
	* @param 	{query.timerange} 	timeRange - filter based on timeRange
	* @param 	{query.size} 		size - limit the size of the results
	* @returns 	{BarChartResp}  Bar Chart response with success and x y value 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/ 
	@Get(':sitecode/barchart')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ title: 'Chart data from elastic search' })
	@ApiImplicitParam({
        name:		 'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required: 	 true, 
        type: 		 'number'
	})
	/**
	* @name Query  
	**/
	@ApiImplicitQuery({
        name:		 'isdepartment', 
        description: '(Optional) Department or NonDepartment - filter based on department', 
        required: 	 true, 
        type: 		 'boolean',
        enum: 		 ['true', 'false']
	})
	@ApiImplicitQuery({
        name:		 'timerange', 
        description: '(Optional) timerange - filter based on timerange', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['today', 'yesterday', 'thisweek', 'thismonth']
	})
	@ApiImplicitQuery({
        name:		 'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required: 	 false, 
        type: 		 'number'
	})
	/**
	* @name Responses 
	**/
	@ApiOkResponse({ 
		// status: 200, 
		description: 'The response for elastic chart series.data field',
		type: BarChartResp
	})
	@ApiResponse({ 
		/* @ApiUnauthorizedResponse ** not released yet **/
		status: 401, 
		description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
		type: AuthErrorRes
	})
	@ApiForbiddenResponse({ 
		description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
		type: AuthErrorRes
	})
	@ApiUnprocessableEntityResponse({ 
		description: 'Validation Error - A list of the validation and/or business rules violated',
		type: ValidErrorRes
	})	
	@ApiServiceUnavailableResponse({ 
		description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiRequestTimeoutResponse({ 
		description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
		type: PlatErrorRes
	})
	@ApiInternalServerErrorResponse({ 
		description: 'Server Error - A runtime error to be fixed by developer',
		type: ServerErrorRes
	})
	@UseGuards(AuthGuard('jwt'))
	async barChart(
		@Param('sitecode') siteCode, 
		@Query('isdepartment') isDepartment: boolean, 
		@Query('timerange') timeRange?: TimeRangeEnum, 
		@Query('size') size?,
	): Promise<BarChartResp|ErrRes> {

		try{
			const validSiteCode = validateSiteCode(siteCode);
			
			let searchResults = await this.topWebsitesByBandwidthService.barChart(
				validSiteCode, 
				isDepartment,
				timeRange,
				size
			);
			return Promise.resolve(new BarChartResp(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}
}