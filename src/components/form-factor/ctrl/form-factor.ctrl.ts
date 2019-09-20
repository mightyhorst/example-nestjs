/**
* Swagger 
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
* Endpoint
**/
import {
	Logger, 
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
* Services 
**/
import { FormFactorService } from '../service/form-factor.service';

/**
* Responses 
**/
import { 
	FormFactorResponseDto as ResDto, 
	// FormFactorErrorResponseDto as ErrDto, 
	FormFactorChartResponseDto  as ChartDto
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
* Errors 
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
import {WarrantyTypes} from '@components/warranty/types';
import { FormFactorTypes } from '@components/form-factor/index';


/**
*
* @class FormFactorController  
*
**/
@ApiUseTags('form-factor')
@ApiBearerAuth()
@Controller('api/v2/form-factor')
export class FormFactorController {

	constructor(private readonly formFactorService: FormFactorService){

	}

	/**
	* @name get es query 
	* @description GET /api/v2/form-factor/{sitecode}
	* @description Directly query Elastic Search
	* @param 	{params.sitecode} 	sitecode - school ID
	* @param 	{query.warranty} 	warranty - filter based on warranty
	* @param 	{query.formfactor} 	formfactor - filter based on formfactor
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
        type: 		 'string'
	})
	@ApiImplicitQuery({
        name:		 'age', 
        description: '(Optional) ageOfDevice - filter based on ageOfDevice', 
        required: 	 false, 
        type: 		 'string'
	})
	@ApiImplicitQuery({
        name:		 'utilisation', 
        description: '(Optional) utilisation - filter based on utilisation', 
        required: 	 false, 
        type: 		 'string'
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
		@Param('sitecode') sitecode, 
		@Query('formfactor') formFactor?: FormFactorTypes,
		@Query('warranty') warranty?: WarrantyTypes,
		@Query('age') age?,
		@Query('utilisation') utilisation?,
		@Query('model') model?,
		@Query('size') size?,
	): Promise<ResDto|ErrRes> {
		
		try{
			let searchResults = await this.formFactorService.search(
				sitecode, 
				formFactor, 
				warranty,
				age,
				utilisation,
				model,
				size);
			return Promise.resolve(new ResDto(searchResults));
		}
		catch(err){
			Logger.error('[FormFactorController.chart] err:', err);
			return errorHandling(err);
		}

	}



	/**
	* @name get chart data 
	* @description GET /api/v2/form-factor/{sitecode}/chart
	* @description Chart data from elastic search
	* @param 	{params.sitecode} 	sitecode - school ID
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
        type: 		 'string'
	})
	@ApiImplicitQuery({
        name:		 'age', 
        description: '(Optional) ageOfDevice - filter based on ageOfDevice', 
        required: 	 false, 
        type: 		 'string'
	})
	@ApiImplicitQuery({
        name:		 'utilisation', 
        description: '(Optional) utilisation - filter based on utilisation', 
        required: 	 false, 
        type: 		 'string'
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
		@Param('sitecode') sitecode, 
		@Query('formfactor') formFactor?: FormFactorTypes,
		@Query('warranty') warranty?: WarrantyTypes,
		@Query('age') age?,
		@Query('utilisation') utilisation?,
		@Query('model') model?,
		@Query('size') size?
	): Promise<ChartDto|ErrRes> {

		try{
			let searchResults = await this.formFactorService.searchToChart(
				sitecode, 
				formFactor,
				warranty,
				age,
				utilisation,
				model,
				size);
			return Promise.resolve(new ResDto(searchResults));
		}
		catch(err){
			Logger.error('[FormFactorController.chart] err:', err);
			return errorHandling(err);
		}

	}

}