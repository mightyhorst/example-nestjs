import {Test, TestingModule} from '@nestjs/testing';
import {FormFactorController} from './form-factor.ctrl';
import {FormFactorService} from '../service/form-factor.service';
import {WarrantyTypes} from "@components/warranty/types";
import {AgeRanges} from "@components/age/types";
import {UtilisationTypes} from "@components/utilisation/types";
import {BarChartDto} from "@models/responses";


class MockService{
	async searchToChart(
		siteCode:number,
		warranty?:WarrantyTypes,
		age?:AgeRanges,
		utilisation?:UtilisationTypes,
		model?:string,
		size?:number
	): Promise<BarChartDto[]> {
		return [
			new BarChartDto("foo", 100),
		]
	}
}

describe('FormFactor Controller', () => {
	let controller: FormFactorController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [FormFactorController],
	  		providers: [
	  		    {
	  		        provide: FormFactorService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<FormFactorController>(FormFactorController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should be able to filter form-factor by warranty eg. expired', async () => {
		const response = await controller.chart(1086, WarrantyTypes.expired);

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter form-factor by age eg. 5_plus_years_old', async () => {
		const response = await controller.chart(1086, null, '5_plus_years_old');

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter form-factor by utilisation eg. used this week', async () => {
		const response = await controller.chart(1086, null, null, UtilisationTypes.this_week);

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter form-factor by model eg. HP ProBook G5', async () => {
		const response = await controller.chart(1086, null, null, null, 'HP ProBook G5');

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});
});