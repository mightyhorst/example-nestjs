import { ApiModelProperty } from '@nestjs/swagger';
import {DevicesCountDto} from "@components/devices/dto/devices.count.dto";

export class DevicesCountResponseDto {

	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	/*@todo - add response body*/
	@ApiModelProperty({required: false, description: 'On Success, data table payload from the successful request.'})
	data?: DevicesCountDto;

	constructor(data?: DevicesCountDto){
		this.success = true;
		this.data = data;
	}
}

