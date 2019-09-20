import { ApiModelProperty } from '@nestjs/swagger';
import { HttpError, ErrorType } from './http.error';

export class AuthError extends HttpError{

	constructor(message:string, req?: Request, code?:number){
		super(code || 401, ErrorType.Authorization, message, req );

		this.description = 'Authorization or Authentication error';
	}

}
