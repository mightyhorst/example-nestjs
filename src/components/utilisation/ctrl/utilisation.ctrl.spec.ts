import { Test, TestingModule } from '@nestjs/testing';
import { UtilisationController } from './utilisation.ctrl';
import { UtilisationService } from '../service/utilisation.service';


class MockService{
    async search(siteCode:number, size?:number){
        return ['result'];
    }
}

describe('Utilisation Controller', () => {
	let controller: UtilisationController;
	
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		controllers: [UtilisationController],
	  		providers: [
	  		    {
	  		        provide: UtilisationService,
	  		        useClass: MockService
	  		    }
	  		]
		}).compile();
	
		controller = module.get<UtilisationController>(UtilisationController);
	});
	
	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});