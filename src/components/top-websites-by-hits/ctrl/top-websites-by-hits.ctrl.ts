import { Injectable, Logger } from '@nestjs/common';
import { InjectConfig } from 'nestjs-config';

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
import { TopWebsitesByHitsService } from '../service/top-websites-by-hits.service';

/**
* @import Responses 
**/
import { 
	TopWebsitesByHitsResponseDto as ResDto, 
	// TopWebsitesByHitsErrorResponseDto as ErrDto, 
	TopWebsitesByHitsChartResponseDto  as ChartDto
} from '../dto/index';
import { 
	AuthErrorResponseDto as AuthErrorRes,
	ValidationErrorResponseDto as ValidErrorRes,
	IntegrationErrorResponseDto as PlatErrorRes,
	ServerErrorResponseDto as ServerErrorRes,
	ErrorResponseDto as ErrRes
} from '@responses/index';

/**
* @import Middleware + Utils
**/
import {
	errorHandling
} from '@middleware/index'
import {
	validateSiteCode
} from '@utils/index'

/**
* @import Errors and Types
**/
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, 
	IntegrationError, 
	AuthError 
} from '@errors/index';
import { AuthGuard } from '@nestjs/passport';
import { WarrantyTypes } from "@components/warranty/types";
import { TimeRangeEnum } from '@enums/index';


/**
*
* @class TopWebsitesByHitsController  
*
**/
@ApiUseTags('top-websites-by-hits')
@ApiBearerAuth()
@Controller('api/v2/top-websites-by-hits')
export class TopWebsitesByHitsController {

	private maxSize:number;

	constructor(
		@InjectConfig() private readonly config, 
		private readonly topWebsitesByHitsService: TopWebsitesByHitsService
	){
		this.maxSize = this.config.get('elasticsearch').max_size;
	}

	/**
	* @name get es query 
	* @description GET /api/v2/top-websites-by-hits/{sitecode}
	* @description Directly query Elastic Search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.department} 	department - filter based on department
	* @param 	{query.timerange} 	timeRange - filter based on timeRange
	* @param 	{query.size} 		size - limit the size of the results
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
		@Query('size') size?,
	): Promise<ResDto|ErrRes> {
		
		try{
			const sizer = size || this.maxSize;
			const validSiteCode = validateSiteCode(siteCode);

			let searchResults = await this.topWebsitesByHitsService.search(
				siteCode, 
				isDepartment,
				timeRange,
				sizer
			);
			return Promise.resolve(new ResDto(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}



	/**
	* @name get chart data 
	* @description GET /api/v2/top-websites-by-hits/{sitecode}/chart
	* @description Chart data from elastic search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.department} 	department - filter based on department
	* @param 	{query.timerange} 	timeRange - filter based on timeRange
	* @param 	{query.size} 		size - limit the size of the results
	* @returns 	{ChartDto} 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/ 
	@Get(':sitecode/chart')
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
        description: '(Optional) isdepartment - filter based on department', 
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
		type: ChartDto
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
	async chart(
		@Param('sitecode') siteCode, 
		@Query('isdepartment') isDepartment?: boolean, 
		@Query('timerange') timeRange?: TimeRangeEnum, 
		@Query('size') size?,
	): Promise<ChartDto|ErrRes> {

		try{
			const sizer = size || this.maxSize;
			const validSiteCode = validateSiteCode(siteCode);

			let searchResults = await this.topWebsitesByHitsService.searchToChart(
				validSiteCode, 
				isDepartment,
				timeRange,
				sizer
			);
			return Promise.resolve(new ChartDto(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}

}