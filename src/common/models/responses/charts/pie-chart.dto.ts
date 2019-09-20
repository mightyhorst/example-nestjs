import { ApiModelProperty } from '@nestjs/swagger';
import { capitalize } from '@utils/index';

export class PieChartDto{

	@ApiModelProperty({required: true, description: 'Name of the pie item', default: 'e.g. Chrome'})
	name: string; 	

	@ApiModelProperty({required: true, description: 'Value on the y-axis as a percentage', default: 62.74})
	y: number; 		


	constructor(name: string, value: number){
		this.name = capitalize(name);
		this.y = value;
	}
}

