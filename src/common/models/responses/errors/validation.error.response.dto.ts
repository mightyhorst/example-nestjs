import { ApiModelProperty } from '@nestjs/swagger';

import { ValidationError } from '@errors/index';
import { ErrorResponseDto } from '../index';

export class ValidationErrorResponseDto extends ErrorResponseDto{

	constructor(error: ValidationError){
		super(error);
	}	
}

