import { ApiModelProperty } from '@nestjs/swagger';

import { AuthError } from '@errors/index';
import { ErrorResponseDto } from '../index';

export class AuthErrorResponseDto extends ErrorResponseDto{

	constructor(error: AuthError){
		super(error);
	}	
}

