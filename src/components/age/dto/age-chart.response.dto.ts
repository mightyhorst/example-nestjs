import { ApiModelProperty } from '@nestjs/swagger';

import { HttpError } from '@errors/index';
import { PieChartDto } from '@responses/index';

export class AgeChartResponseDto{
	
	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	@ApiModelProperty({
		required: true, 
		description: 'On Success, series data for the Pie Chart. e.g. [{"name": "Chrome", "y": 60}]', 
		default: new PieChartDto('Chrome', 64)
	})
	data: PieChartDto[];

	constructor(data:PieChartDto[]){
		this.success = true;
		this.data = data;
	}	
}

