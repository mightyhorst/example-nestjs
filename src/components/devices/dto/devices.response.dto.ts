import { ApiModelProperty } from '@nestjs/swagger';

import { HttpError } from '@errors/index';

import {DevicesTableDto } from './index';

export class DevicesResponseDto{

	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	/*@todo - add response body*/
	@ApiModelProperty({required: false, description: 'On Success, data table payload from the successful request.'})
	data?: DevicesTableDto;

	constructor(data?: DevicesTableDto){
		this.success = true;
		this.data = data;
	}
}

