import { Test, TestingModule } from '@nestjs/testing';
import { FormFactorService } from './form-factor.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

class MockElasticSearchService{
    async query(index:string, query){
        return ['result']
    }
}

describe('FormFactorService', () => {
  	let service: FormFactorService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			FormFactorService,
	  			{
	  				provide: ElasticSearchService,
	  				useClass: MockElasticSearchService
	  			}
	  		],
		}).compile();

		service = module.get<FormFactorService>(FormFactorService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
