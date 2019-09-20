import { Test, TestingModule } from '@nestjs/testing';
import { TopWebsitesByBandwidthController } from './top-websites-by-bandwidth.ctrl';
import { TopWebsitesByBandwidthService } from '../service/top-websites-by-bandwidth.service';
import { TimeRangeEnum } from '@enums/index';
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, IValidationRuleError, 
	IntegrationError, 
	AuthError 
} from '@errors/index';
import { ErrorResponseDto as ErrRes } from '@responses/index';
import { ElasticSearchResponse } from '@services/services.module';
import { PieChartDto } from '@responses/charts/index';

import { exampleEsResponse } from '../service/index';
import { 
	TopWebsitesByBandwidthResponseDto as ResDto, 
	TopWebsitesByBandwidthChartResponseDto as ChartDto,
	/** @todo TopWebsitesByBandwidthErrorResponseDto as ErrDto, **/
} from '../dto/index';

const pieCharts = [
	new PieChartDto('Department', 100),
	new PieChartDto('Non-Department', 200)
]

class MockService{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	return Promise.resolve(pieCharts);
	}
}
class MockServiceAuthError{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        throw new AuthError('AuthError');
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	throw new AuthError('AuthError');
    	return Promise.resolve(pieCharts);
	}
}
class MockServiceValidationError{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        throw new ValidationError('ValidationError');
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	throw new ValidationError('ValidationError');
    	return Promise.resolve(pieCharts);
	}
}
class MockServiceIntegrationError{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        throw new IntegrationError('IntegrationError');
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	throw new IntegrationError('IntegrationError');
    	return Promise.resolve(pieCharts);
	}
}
class MockServiceServerError{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        throw new ServerError('IntegrationError');
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	throw new ServerError('ServerError');
    	return Promise.resolve(pieCharts);
	}
}

/**
* @todo Convert to Generics not working 
*
class MockServiceGenericError<T extends HttpError>{
    async search(
    	siteCode:number, 
		isDepartment?:boolean,
		timeRange?:TimeRangeEnum,
		size?:number
	):Promise<ElasticSearchResponse>{
        throw new T(T.type);
        return Promise.resolve(exampleEsResponse);
    }
    
    async searchToChart(
		siteCode:number, 
		isDepartment?: boolean,
		timeRange?: TimeRangeEnum,
		size?:number
	): Promise<PieChartDto[]>{
    	throw new T(T.type);
    	return Promise.resolve(pieCharts);
	}
}
*/


export enum CtrlType{
	HappyPath = 'HappyPath',
	AuthError = 'AuthError',
	ValidationError = 'ValidationError',
	IntegrationError = 'IntegrationError',
	ServerError = 'ServerError',
	TimeoutError = 'TimeoutError',
	RandomError = 'RandomError',
}
async function buildCtrl(ctrlType:CtrlType) {

	let mockService;
	switch(ctrlType){
		case CtrlType.HappyPath: {
			mockService = MockService;
			break;
		}
		case CtrlType.AuthError: {
			mockService = MockServiceAuthError;
			break;
		}
		case CtrlType.ValidationError: {
			mockService = MockServiceValidationError;
			break;
		}
		case CtrlType.IntegrationError: {
			mockService = MockServiceIntegrationError;
			break;
		}
		case CtrlType.ServerError: {
			mockService = MockServiceServerError;
			break;
		}
		case CtrlType.TimeoutError: {
			// mockService = MockServiceTimeoutError;
			break;
		}
		case CtrlType.RandomError: {
			// mockService = MockServiceRandomError;
			break;
		}
		default: {
			mockService = MockService;
			break;
		}
	}

	const module: TestingModule = await Test.createTestingModule({
  		controllers: [TopWebsitesByBandwidthController],
  		providers: [
  		    {
  		        provide: TopWebsitesByBandwidthService,
  		        useClass: mockService
  		    }
  		]
	}).compile();

	const ctrl = module.get<TopWebsitesByBandwidthController>(TopWebsitesByBandwidthController);
	return Promise.resolve(ctrl);
}


describe('TopWebsitesByBandwidth Controller', () => {
	let ctrl: TopWebsitesByBandwidthController;
	let ctrlAuthError: TopWebsitesByBandwidthController;
	let ctrlValidationError: TopWebsitesByBandwidthController;
	let ctrlIntegrationError: TopWebsitesByBandwidthController;
	let ctrlServerError: TopWebsitesByBandwidthController;
	// let ctrlTimeoutError: TopWebsitesByBandwidthController;
	// let ctrlRandomError: TopWebsitesByBandwidthController;
	
	beforeEach(async () => {
		ctrl = await buildCtrl(CtrlType.HappyPath);
		ctrlAuthError = await buildCtrl(CtrlType.AuthError);
		ctrlValidationError = await buildCtrl(CtrlType.ValidationError);
		ctrlIntegrationError = await buildCtrl(CtrlType.IntegrationError);
		ctrlServerError = await buildCtrl(CtrlType.ServerError);
		// ctrlTimeoutError = await buildCtrl(CtrlType.TimeoutError);
		// ctrlRandomError = await buildCtrl(CtrlType.RandomError);
	});
	
	it('#check should be defined', () => {
		expect(ctrl).toBeDefined();
		expect(ctrlAuthError).toBeDefined();
		expect(ctrlValidationError).toBeDefined();
		expect(ctrlIntegrationError).toBeDefined();
		expect(ctrlServerError).toBeDefined();
		// expect(ctrlTimeoutError).toBeDefined();
		// expect(ctrlRandomError).toBeDefined();
	});

	describe('Happy Path', async () => {

		it('should work with sitecode, isDepartment, today, size', async () => {

			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.today;

			const resp:ResDto = await ctrl.search(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);
		});

		it('should return Pie Chart data with sitecode, isDepartment, today, size', async () => {

			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.today;

			const resp = await ctrl.chart(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);
		});

		it('should work with sitecode, isDepartment=false, yesterday, size', async () => {
			
			const siteCode = 1234;
			const isDepartment = false;
			const size = 1000;
			const timeRange = TimeRangeEnum.yesterday;

			const resp:ResDto = await ctrl.search(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);

		});

		it('should show charts with sitecode, isDepartment=false, yesterday, size', async () => {
			
			const siteCode = 1234;
			const isDepartment = false;
			const size = 1000;
			const timeRange = TimeRangeEnum.yesterday;

			const resp = await ctrl.chart(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);

		});
		it('should work with sitecode, isDepartment, thisweek, size', async () => {
			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.thisweek;

			const resp:ResDto = await ctrl.search(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);
		});
		it('should showcharts  with sitecode, isDepartment, thisweek, size', async () => {
			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.thisweek;

			const resp = await ctrl.chart(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);
		});
		
		it('should work with sitecode, isDepartment, this month, size', async () => {
			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.thismonth;

			const resp:ResDto = await ctrl.search(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);
		});
		it('should show charts with sitecode, isDepartment, this month, size', async () => {
			const siteCode = 1234;
			const isDepartment = true;
			const size = 100;
			const timeRange = TimeRangeEnum.thismonth;

			const resp = await ctrl.chart(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);
		});
		it('should work with sitecode, size', async () => {
			const siteCode = 1234;
			const isDepartment = null;
			const size = 100;
			const timeRange = null;

			const resp:ResDto = await ctrl.search(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);
		});
		it('should show charts with sitecode, size', async () => {
			const siteCode = 1234;
			const isDepartment = null;
			const size = 100;
			const timeRange = null;

			const resp = await ctrl.chart(
				siteCode, 
				isDepartment, 
				timeRange,
				size
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);
		});
		
		it('should work with siteCode', async () => {
			const siteCode = 1234;

			const resp:ResDto = await ctrl.search(
				siteCode
			)
			expect(resp.success).toEqual(true);
			expect(resp.data).toEqual(exampleEsResponse);
		});
		it('should show chart with siteCode', async () => {
			const siteCode = 1234;

			const resp = await ctrl.chart(
				siteCode
			)
			expect(resp.success).toEqual(true);
			if(resp.hasOwnProperty('data')) expect(resp['data']).toEqual(pieCharts);
		});

	});

	describe('Validation Errors - invalid sitecode', async ()=>{

		it('should throw validation error for invalid sitecode', async () => {
			
			const siteCode = 123456;

			try{
				const resp:ResDto = await ctrl.search(siteCode);
			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`123456 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual(siteCode);
			}
		});

		it('should throw validation error for invalid sitecode for chart', async () => {
			
			const siteCode = 123456

			try{
				const resp:ResDto = await ctrl.chart(siteCode);

			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof ValidationError).toBe(true);
				expect(err.message).toEqual(`123456 is not a 4 digit number`);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual(siteCode);
			}
		});

	});


	describe('Validation Errors', async ()=>{

		it('#search should throw and catch Validation Errors', async ()=>{
			const siteCode = 123456;
			try{
				await ctrlValidationError.search(siteCode);	
			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof ValidationError).toBe(true);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual(siteCode);
			}
		})

		it('#chart should throw and catch Validation Errors', async ()=>{
			const siteCode = 123456;
			try{
				await ctrlValidationError.search(siteCode);	
			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof ValidationError).toBe(true);
				expect(err.code).toEqual(422);
				expect(err.validationError.field).toEqual('sitecode');
				expect(err.validationError.packet).toEqual('param');
				expect(err.validationError.value).toEqual(siteCode);
			}
		})

	});

	describe('Auth Errors', async ()=>{

		it('#search should throw and catch Auth Errors', async ()=>{
			
			try{
				await ctrlAuthError.search('1234');	
			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof AuthError).toBe(true);
				expect(err.code).toEqual(401);
			}
			
		})

		it('#chart should throw and catch Auth Errors', async ()=>{
			try{
				await ctrlAuthError.chart('1234');	
			}catch(errRes){
				const err = errRes.error;
				expect(err instanceof AuthError).toBe(true);
				expect(err.code).toEqual(401);
			}
		})

	});

	describe('Integration Errors', async ()=>{

		it('#search should throw and catch Integration Errors', async ()=>{

			// ctrlIntegrationError
			
		})

		it('#chart should throw and catch Integration Errors', async ()=>{
			
		})

	});

	describe('Server Errors', async ()=>{

		it('#search should throw and catch Server Errors', async ()=>{
			// ctrlServerError
			
		})

		it('#chart should throw and catch Server Errors', async ()=>{
			
		})

	});


	describe.skip('Timeout Errors', async ()=>{

		it('@todo #search should gracefully catch Timeout Errors', async ()=>{
			// ctrlTimeoutError
			
		})

		it('@todo #chart should gracefully catch Timeout Errors', async ()=>{
			
		})

	});


	describe.skip('Random Errors', async ()=>{

		it('@todo #search should gracefully catch random Errors', async ()=>{
			// ctrlRandomError
		})

		it('@todo #chart should gracefully catch random Errors', async ()=>{
			
		})

	});

});