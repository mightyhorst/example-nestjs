import { Test, TestingModule } from '@nestjs/testing';
import { AgeController } from './age.ctrl';
import { AgeService } from '../service/age.service';
import { 
	AgeResponseDto as ResDto,
	AgeErrorResponseDto as ErrDto, 
	AgeChartResponseDto as ChartDto
} from '../dto/index';

/**
* @requires Types
**/
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes} from '@components/utilisation/types';
import { WarrantyTypes } from '@components/warranty/types';

import { mockEsResponse, MockService } from '../../../../test/mocks/index';

describe('Age Controller', () => {
	let controller: AgeController;
	let service: AgeService;	
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [AgeController],
	  		providers: [
	  		    {
	  		        provide: AgeService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<AgeController>(AgeController);
		service = module.get<AgeService>(AgeService);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	const siteCode = 1;
	const formFactor: string = 'Desktop';
	const warranty: WarrantyTypes = WarrantyTypes.covered; 
	const ageOfDevice:AgeRanges = '2_years_old';
	const utilisation: UtilisationTypes = UtilisationTypes.last_week;
	const model: string = 'Desktop';
	const size: number = 100;

	it('should search by site ID', async () => {
	      
	      const spy = jest.spyOn(service, 'search');

	      expect(await controller.search(siteCode)).toEqual(new ResDto(mockEsResponse));
	      expect(spy).toHaveBeenCalledTimes(1);

	});

	describe('should search by site ID and formfactor', async () => {

		it('should search by site ID and formfactor', async () => {

			const spy = jest.spyOn(service, 'search');
			
			const result:ResDto = await controller.search(
				siteCode, 
				formFactor
			);

			expect(result).toEqual(new ResDto(mockEsResponse));

			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			

			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, formfactor and warranty', async () => {

			const spy = jest.spyOn(service, 'search');
			
			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				warranty
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isWarranty: true
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, formfactor and utilisation', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				null,
				null,
				utilisation,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isUtilisation: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, formfactor and model', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				null,
				null,
				null,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, formfactor and size', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				null,
				null,
				null,
				null,
				size
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toEqual(true);
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isSize: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
	});
		

	describe('should search by site ID and warranty', async () => {


		it('should search by site ID and warranty', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				null,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, warranty and formfactor', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				warranty,
				null,
				null,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isWarranty: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, warranty and utilisation', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				utilisation,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
				isUtilisation: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, warranty and model', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				null,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, warranty and size', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				null,
				null,
				size
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toEqual(true);
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
				isSize: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});

	});
	
	describe('should search by site ID and utilisation', async () => {

		it('should search by site ID and utilisation', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				utilisation,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isUtilisation: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, utilisation and formfactor', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				null,
				null,
				utilisation,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isUtilisation: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, utilisation and warranty', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				utilisation,
				null,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
				isUtilisation: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, utilisation and model', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				utilisation,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isUtilisation: true,
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, utilisation and size', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				utilisation,
				null,
				size
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toBeUndefined();
			expect(result.data.hits.hits._source.isSize).toEqual(true);
			
			expect(result.data.hits.hits._source).toEqual({
				isUtilisation: true,
				isSize: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		

	});
	
	describe('should search by site ID and model', async () => {


		it('should search by site ID and model', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				null,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);

		});
		it('should search by site ID, model and formfactor', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				formFactor,
				null,
				null,
				null,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toEqual(true);
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isFormfactor:true, 
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});
		it('should search by site ID, model and warranty', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				warranty,
				null,
				null,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toEqual(true);
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isWarranty: true,
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});

		it('should search by site ID, model and utilisation', async () => {

			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				utilisation,
				model,
				null
			);

			expect(result).toEqual(new ResDto(mockEsResponse));
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toEqual(true);
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toBeUndefined();
			
			expect(result.data.hits.hits._source).toEqual({
				isUtilisation: true,
				isModel: true,
			});
			expect(spy).toHaveBeenCalledTimes(1);
			

		});

		it('should search by site ID, model and size', async () => {


			const spy = jest.spyOn(service, 'search');

			const result:ResDto = await controller.search(
				siteCode, 
				null,
				null,
				null,
				null,
				model,
				size
			);

			expect(result).toEqual(new ResDto(mockEsResponse));

			expect(result.data.hits.hits._source).toEqual({
				isModel: true,
				isSize: true,
			});
			
			expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
			expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
			expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
			expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
			expect(result.data.hits.hits._source.isModel).toEqual(true);
			expect(result.data.hits.hits._source.isSize).toEqual(true);
			
			expect(spy).toHaveBeenCalledTimes(1);

		});

	});

	
	it('should search by site ID and size', async () => {

		const spy = jest.spyOn(service, 'search');

		const result:ResDto = await controller.search(
			siteCode, 
			null,
			null,
			null,
			null,
			null,
			size
		);

		expect(result).toEqual(new ResDto(mockEsResponse));
		
		expect(result.data.hits.hits._source.isFormfactor).toBeUndefined();
		expect(result.data.hits.hits._source.isWarranty).toBeUndefined();
		expect(result.data.hits.hits._source.isAgeOfDevice).toBeUndefined();
		expect(result.data.hits.hits._source.isUtilisation).toBeUndefined();
		expect(result.data.hits.hits._source.isModel).toBeUndefined();
		expect(result.data.hits.hits._source.isSize).toEqual(true);
		
		expect(result.data.hits.hits._source).toEqual({
			isSize: true,
		});
		expect(spy).toHaveBeenCalledTimes(1);
		

	});
	
	
});