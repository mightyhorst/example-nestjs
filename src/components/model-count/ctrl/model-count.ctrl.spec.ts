import { Test, TestingModule } from '@nestjs/testing';
import { ModelCountController } from './model-count.ctrl';
import { ModelCountService } from '../service/model-count.service';


class MockService{
    async search(siteCode:number, size?:number){
        return ['result'];
    }
}

describe('ModelCount Controller', () => {
	let controller: ModelCountController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [ModelCountController],
	  		providers: [
	  		    {
	  		        provide: ModelCountService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<ModelCountController>(ModelCountController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});