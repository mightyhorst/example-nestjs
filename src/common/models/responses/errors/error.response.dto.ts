import { ApiModelProperty } from '@nestjs/swagger';

import { 
	HttpError, 
	AuthError, 
	ValidationError, 
	IntegrationError, 
	ServerError ,
	ErrorType
} from '@errors/index';

export class ErrorResponseDto{
	
	@ApiModelProperty({required: true, description: 'Flag failure', default: false})
	success: boolean;

	@ApiModelProperty({required: true, description: 'Error response'})
	type: ErrorType;

	@ApiModelProperty({required: false, description: 'On error, Error for a single error'})
	error: HttpError | AuthError | ValidationError | IntegrationError| ServerError;

	/**
	* @method convert error for debug logs 
	**/
	toJson(){
		/**
		* Custom Errors
		**/
		if(this.error.hasOwnProperty('toJson')){
			return this.error.toJson();
		}

		/**
		* Generic Error 
		**/
		else{
			return {code: 500, message: this.error.message};
		}
	}

	constructor(err: HttpError | AuthError | ValidationError | IntegrationError| ServerError){
		this.success = false;
		this.type = err.type;
		this.error = err;
	}	
}

