import 'reflect-metadata';
import { PieChartDto } from './index';

describe('Common/Models/Responses', () => {
	describe('PieChartDto', () => {

		it('should be cool with name and number', () => {
			const name = 'please capitalise me';
			const value = 200;
			const dto = new PieChartDto(name, value);

			expect(dto).toEqual(<PieChartDto>{
				name: 'Please Capitalise Me',
				y: 200
			});
		});

	});
});