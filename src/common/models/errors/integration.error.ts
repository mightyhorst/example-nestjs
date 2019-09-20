import { ApiModelProperty } from '@nestjs/swagger';
import { HttpError, ErrorType } from './http.error';

export class IntegrationError extends HttpError{

	constructor(message:string, req?: Request, code?:number){
		super(code || 504, ErrorType.Integration, message, req);

		this.description = '504 Integration error (problem downstream with ElasticSearch or Identity Provider)';
	}

}
export class ElasticSearchError extends IntegrationError{
	constructor(message:string){
		super('ElasticSearch error - '+message);
	}
}