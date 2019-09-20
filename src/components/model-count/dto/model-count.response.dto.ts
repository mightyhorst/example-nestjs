import { ApiModelProperty } from '@nestjs/swagger';

import { HttpError } from '@errors/index';

export class ModelCountResponseDto{

	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	/*@todo - add response body*/
	@ApiModelProperty({required: false, description: 'On Success, data payload from the successful request. @todo - update for each DTO'})
	data?: any;
	
	constructor(data?: any){
		this.success = true;
		this.data = data;
	}
}

