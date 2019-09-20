import { ApiModelProperty } from '@nestjs/swagger';

import { HttpError } from '@errors/index';
import { PieChartDto, BarChartDto } from '@responses/charts/index';

/**
* @todo Generic Response
*
export class TopWebsitesByBandwidthChartResponseDto<T>{
	
	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	@ApiModelProperty({
		required: true, 
		description: 'On Success, series data for the Pie Chart. e.g. [{"name": "Chrome", "y": 60}]', 
		default: new T('Chrome', 64)
	})
	data: T[];

	constructor(data:T[]){
		this.success = true;
		this.data = data;
	}	
}*/
export class TopWebsitesByBandwidthPieChartResponseDto{
	
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
export class TopWebsitesByBandwidthBarChartResponseDto{
	
	@ApiModelProperty({required: true, description: 'Flag for success or fail'})
	success: boolean;

	@ApiModelProperty({
		required: true, 
		description: 'On Success, series data for the Bar Chart. e.g. [{"name": "Chrome", "y": 60}]', 
		default: new BarChartDto('Chrome', 64)
	})
	data: BarChartDto[];

	constructor(data:BarChartDto[]){
		this.success = true;
		this.data = data;
	}	
}