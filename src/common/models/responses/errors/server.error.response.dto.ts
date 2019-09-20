import { ApiModelProperty } from '@nestjs/swagger';

import { ServerError } from '@errors/index';
import { ErrorResponseDto } from '../index';

export class ServerErrorResponseDto extends ErrorResponseDto{

	constructor(error: ServerError){
		super(error);
	}	
}

