import { Response } from 'express';

/**
* Errors 
**/
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, IValidationRuleError, 
	IntegrationError, 
	AuthError 
} from '@errors/index';

/**
* Responses 
**/
import { 
	AuthErrorResponseDto as AuthErrorRes,
	ValidationErrorResponseDto as ValidErrorRes,
	IntegrationErrorResponseDto as PlatErrorRes,
	ServerErrorResponseDto as ServerErrorRes,
	ErrorResponseDto as ErrRes
} from '@responses/index';

/**
* @name errorHandling 
* @description Error handling 
* @param {Error} err - error 
* @returns {Promise<AuthErrorRes|ValidErrorRes|PlatErrorRes|ServerErrorRes>} error response
**/
export function errorHandling(err):Promise<AuthErrorRes|ValidErrorRes|PlatErrorRes|ServerErrorRes>{

	let response: ErrRes;
	switch(err.type) {		
		
		case ErrorType.Authorization: {
			response = new AuthErrorRes(err);
			console.log('[🦄.case.AuthError] response', response.toJson());	
			break;
		}

		case ErrorType.Validation:{
			response = new ValidErrorRes(err);	
			console.log('[🙅‍♂️.case.ValidationError] response', response.toJson());
			break;
		}

		case ErrorType.Integration:{
			response = new PlatErrorRes(err);	
			console.log('[🍑.case.IntegrationError] response', response.toJson());
			break;
		}
		
		default: {
			response = new ServerErrorRes(err);	
			console.log('[🍏.case.ServerErrorRes] response', response.toJson());
			break;
		}
	}

	return Promise.reject(response);

}