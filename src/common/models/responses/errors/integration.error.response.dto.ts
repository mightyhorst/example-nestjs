import { ApiModelProperty } from '@nestjs/swagger';

import { IntegrationError } from '@errors/index';
import { ErrorResponseDto } from '../index';

export class IntegrationErrorResponseDto extends ErrorResponseDto{

	constructor(error: IntegrationError){
		super(error);
	}	
}

