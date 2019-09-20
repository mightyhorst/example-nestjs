import { ApiModelProperty, ResponseMetadata } from '@nestjs/swagger';
import { Request } from '@models/requests/index';

export enum ErrorType {
	Authorization = '401 Authorization Error',
	Server = '500 Server error (runtime error to be fixed by developer)', 
	Validation = '422 Validation error (request was invalid)', 
	Integration = '522 Integration error (problem downstream with ElasticSearch or Identity Provider)'
}

export class HttpError extends Error implements ResponseMetadata{

	/** 
	* ResponseMetaData intefrace 
	**/
	description?: string;
	isArray?:boolean;

	code: number;

	@ApiModelProperty({ 
		required: true, 
		enum: ['Authorization', 'Server', 'Validation', 'Integration'], 
		description: 'Type of Error including 401 Authorization Error,  500 Server error (runtime error to be fixed by developer), 422 Validation error (request was invalid), 522 Integration error (problem downstream with ElasticSearch or Identity Provider)' 
	})
	type: ErrorType;

	@ApiModelProperty()
	message: string;

	@ApiModelProperty()
	req: Request;

	toJson(){
		return {
			code: this.code,
			type: this.type,
			message: this.message,
			req: this.req,
			description: this.description
		}
	}

	constructor(code:number, type:ErrorType, message:string, req?: Request){
		super(message);
		this.code = code || 500;
		this.type = type;
		this.req = req || {};

		/** 
		* ResponseMetaData intefrace 
		**/
		this.description = 'HTTP Custom Error';
		this.isArray = false;
	}

}