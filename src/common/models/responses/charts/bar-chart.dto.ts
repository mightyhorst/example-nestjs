import { ApiModelProperty } from '@nestjs/swagger';
import { capitalize } from '@utils/index';

export class BarChartDto{

	@ApiModelProperty({required: true, description: 'Name of the bar item', default: 'e.g. Chrome'})
	name: string; 	

	@ApiModelProperty({required: true, description: 'Value on the y-axis', default: 62.74})
	y: number; 		


	constructor(name: string, value: number){
		this.name = capitalize(name);
		this.y = value;
	}
}

