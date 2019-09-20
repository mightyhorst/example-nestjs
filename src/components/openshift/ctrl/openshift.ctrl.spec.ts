import { Test, TestingModule } from '@nestjs/testing';
import { OpenshiftController } from './openshift.ctrl';
import { OpenshiftService } from '../service/openshift.service';


class MockService{
    async search(siteCode:number, size?:number){
        return ['result'];
    }
}

describe('Openshift Controller', () => {
	let controller: OpenshiftController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [OpenshiftController],
	  		providers: [
	  		    {
	  		        provide: OpenshiftService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<OpenshiftController>(OpenshiftController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});