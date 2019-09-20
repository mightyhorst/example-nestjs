import { Test, TestingModule } from '@nestjs/testing';
import { OpenshiftService } from './openshift.service';

describe('OpenshiftService', () => {
  	let service: OpenshiftService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			OpenshiftService
	  		],
		}).compile();

		service = module.get<OpenshiftService>(OpenshiftService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
