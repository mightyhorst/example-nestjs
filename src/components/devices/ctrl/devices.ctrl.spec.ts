import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.ctrl';
import { DevicesService } from '../service/devices.service';
import { WarrantyTypes } from "@components/warranty/types";
import { UtilisationTypes } from "@components/utilisation/types";


class MockService{
    async search(siteCode:number, size?:number){
        return ['result'];
    }
}

describe('DeviceList Controller', () => {
	let controller: DevicesController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [DevicesController],
	  		providers: [
	  		    {
	  		        provide: DevicesService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<DevicesController>(DevicesController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should be able to filter device listing by form-factor eg. laptop', async () => {
		const response = await controller.search(1086, 'laptop', null, null, null);

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter device listing by age eg. 2_years_old', async () => {
		const response = await controller.search(1086, null, '2_years_old', null, null);

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter device listing by utilisation eg. this_week', async () => {
		const response = await controller.search(1086, null, null, UtilisationTypes.this_week, null);

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});

	it('should be able to filter device listing by model eg. HP ProBook G5', async () => {
		const response = await controller.search(1086, null, null, null, 'HP ProBook G5');

		expect(response).toHaveProperty('data');
		// expect(response.data).toHaveProperty('hits');
		// expect(response.data.hits).toHaveProperty('hits');
		// expect(response.data.hits.hits).toHaveLength(1);
		// expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
	});
});