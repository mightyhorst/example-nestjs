import 'reflect-metadata';
import { ApiModelProperty } from '@nestjs/swagger';
import { BarChartDto } from './index';

describe('Common/Models/Responses', () => {
	describe('BarChartDto', () => {

		it('should be cool with name and number', () => {
			const name = 'please capitalise me';
			const value = 200;
			const dto = new BarChartDto(name, value);

			expect(dto).toEqual({
				name: 'Please Capitalise Me',
				y: 200
			});
		});
		
	});
});