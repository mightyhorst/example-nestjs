import { ApiModelProperty } from '@nestjs/swagger';
import { HttpError, ErrorType } from './http.error';

export class ServerError extends HttpError{

	constructor(message:string, req?: Request, code?:number){
		super(code || 500, ErrorType.Server, message, req);

		this.description = '500 Server error (runtime error to be fixed by developer)';
	}

}
