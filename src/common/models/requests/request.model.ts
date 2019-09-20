import { ApiModelProperty } from '@nestjs/swagger';

export class Request{
	
	 @ApiModelProperty({ required: false, description: 'headers from HTTP request' }) 
	headers?:any;

	 @ApiModelProperty({ required: false, description: 'parameters from url from HTTP request' }) 
	params?:any;

	 @ApiModelProperty({ required: false, description: 'query string provided from HTTP request' }) 
	query?:any;

	 @ApiModelProperty({ required: false, description: 'request body from HTTP request' }) 
	body?:any;
}