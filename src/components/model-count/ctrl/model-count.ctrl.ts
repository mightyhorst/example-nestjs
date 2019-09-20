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
	Param, UseGuards
} from '@nestjs/common';


/**
* @import Services 
**/
import { ModelCountService } from '../service/model-count.service';

/**
* @import Responses 
**/
import { 
	ModelCountResponseDto as ResDto, 
	// ModelCountErrorResponseDto as ErrDto, 
	ModelCountChartResponseDto as ChartDto
} from '../dto/index';
import { 
	AuthErrorResponseDto as AuthErrorRes,
	ValidationErrorResponseDto as ValidErrorRes,
	IntegrationErrorResponseDto as PlatErrorRes,
	ServerErrorResponseDto as ServerErrorRes,
	ErrorResponseDto as ErrRes
} from '@responses/index';

/**
* Middleware
**/
import {
	errorHandling
} from '@middleware/index'

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

/**
* @requires Types
**/
import { WarrantyTypes } from '@components/warranty/types';
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { FormFactorTypes } from '@components/form-factor/index';

/**
*
* @class ModelCountController  
*
**/
@ApiUseTags('model-count')
@ApiBearerAuth()
@Controller('api/v2/model-count')
export class ModelCountController {

	constructor(private readonly modelCountService: ModelCountService){

	}


	/**
	* @name get es query 
	* @description GET /api/v2/model-count/{sitecode}
	* @description Directly query Elastic Search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.formfactor} 	formfactor - filter based on formfactor
	* @param 	{query.warranty} 	warranty - filter based on warranty
	* @param 	{query.age} 		ageOfDevice - filter based on age of device
	* @param 	{query.utilisation} utilisation - filter based on utilisation
	* @param 	{query.model} 		model - filter based on model
	* @param 	{query.size} 		size - limit the size of the results
	* @returns 	{ResDto} Response data 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/
	@Get(':sitecode')
	@ApiOperation({ title: 'Directly query Elastic Search' })
	/**
	* @name Params 
	**/
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
        name:		 'formfactor', 
        description: '(Optional) formfactor - filter based on formfactor', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['macos_laptop', 'macos_desktop', 'chromedevice', 'servers', 'desktop', 'laptop', 'unknown']
	})	
	@ApiImplicitQuery({
        name:		 'warranty', 
        description: '(Optional) warranty - filter based on warranty', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['expired','expiring_soon','covered']
	})
	@ApiImplicitQuery({
        name:		 'age', 
        description: '(Optional) age - filter based on age of device', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['1_year_old', '2_years_old', '3_years_old', '4_years_old', '5_plus_years_old']
	})
	@ApiImplicitQuery({
        name:		 'utilisation',
        description: '(Optional) utilisation - filter based on utilisation',
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['this_week', 'last_week','several_weeks_ago', 'over_30_days_old']
	})
	@ApiImplicitQuery({
        name:		 'model',
        description: '(Optional) model - filter based on model',
        required: 	 false, 
        type: 		 'string'
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
		@Param('sitecode') sitecode:number, 
		@Query('formfactor') formFactor?:FormFactorTypes,
		@Query('warranty') warranty?:WarrantyTypes,
		@Query('age') ageOfDevice?:AgeRanges,
		@Query('utilisation') utilisation?:UtilisationTypes,
		@Query('model') model?:string, 
		@Query('size') size?:number,
	): Promise<ResDto|ErrRes> {	
		
		try{
			let searchResults = await this.modelCountService.search(
				sitecode, 
				formFactor,
				warranty,
				ageOfDevice,
				utilisation,
				model, 
				size);
			return Promise.resolve(new ResDto(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}	
	





	/**
	* @name get chart data 
	* @description GET /api/v2/model-count/{sitecode}/chart
	* @description Chart data from elastic search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.formfactor} 	formfactor - filter based on formfactor
	* @param 	{query.warranty} 	warranty - filter based on warranty
	* @param 	{query.age} 		ageOfDevice - filter based on age of device
	* @param 	{query.utilisation} utilisation - filter based on utilisation
	* @param 	{query.model} 		model - filter based on model
	* @param 	{query.size} 		size - limit the size of the results
	* @returns 	{ChartDto} 
	* @returns 	{AuthErrorRes} Unauthorized error 
	* @returns 	{ValidErrorRes} Validation errors 
	* @returns 	{PlatErrorRes} ElasticSearch error 
	* @returns 	{ServerErrorRes} Some problem 
	**/
	@Get(':sitecode/chart')
	@ApiOperation({ title: 'Directly query Elastic Search' })
	/**
	* @name Params 
	**/
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
        name:		 'formfactor', 
        description: '(Optional) formfactor - filter based on formfactor', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['macos_laptop', 'macos_desktop', 'chromedevice', 'servers', 'desktop', 'laptop', 'unknown']
	})	
	@ApiImplicitQuery({
        name:		 'warranty', 
        description: '(Optional) warranty - filter based on warranty', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['expired','expiring_soon','covered']
	})
	@ApiImplicitQuery({
        name:		 'age', 
        description: '(Optional) age - filter based on age of device', 
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['1_year_old', '2_years_old', '3_years_old', '4_years_old', '5_plus_years_old']
	})
	@ApiImplicitQuery({
        name:		 'utilisation',
        description: '(Optional) utilisation - filter based on utilisation',
        required: 	 false, 
        type: 		 'string',
        enum: 		 ['this_week', 'last_week','several_weeks_ago', 'over_30_days_old']
	})
	@ApiImplicitQuery({
        name:		 'model',
        description: '(Optional) model - filter based on model',
        required: 	 false, 
        type: 		 'string'
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
	async chart(
		@Param('sitecode') sitecode:number, 
		@Query('formfactor') formFactor?:FormFactorTypes,
		@Query('warranty') warranty?:WarrantyTypes,
		@Query('age') ageOfDevice?:AgeRanges,
		@Query('utilisation') utilisation?:UtilisationTypes,
		@Query('model') model?:string, 
		@Query('size') size?:number,
	): Promise<ChartDto|ErrRes> {

		try{
			let searchResults = await this.modelCountService.searchToChart(
				sitecode, 
				formFactor,
				warranty,
				ageOfDevice,
				utilisation,
				model, 
				size);
			return Promise.resolve(new ChartDto(searchResults));
		}
		catch(err){
			return errorHandling(err);
		}

	}

}