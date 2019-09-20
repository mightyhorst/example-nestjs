import { ApiModelProperty } from '@nestjs/swagger';

import { HttpError } from '@errors/index';

export class OpenshiftErrorResponseDto{
	
	@ApiModelProperty({required: true, description: 'Flag for success or fail', default: false})
	success: boolean;

	@ApiModelProperty({required: false, description: 'On error, Error for a single error'})
	error?: HttpError;

	@ApiModelProperty({required: false, description: 'On error, Errors for a multiple errors, typically validation errors'})
	errors?: HttpError[];

	/*@todo - add response body*/
	@ApiModelProperty({required: false, description: 'On error, you may optionally pass back some data too to help with debugging'})
	data?: any;

	constructor(data?: any, error?: HttpError, errors?: HttpError[]){
		this.success = false;
		if(error) 	this.error = error;
		if(errors) 	this.errors = errors;
		if(data) 	this.data = data;
	}	
}





