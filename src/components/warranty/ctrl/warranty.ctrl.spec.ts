import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyController } from './warranty.ctrl';
import { WarrantyService } from '../service/warranty.service';


class MockService{
    async search(siteCode:number, size?:number){
        return ['result'];
    }
}

describe('Warranty Controller', () => {
	let controller: WarrantyController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [WarrantyController],
	  		providers: [
	  		    {
	  		        provide: WarrantyService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<WarrantyController>(WarrantyController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});