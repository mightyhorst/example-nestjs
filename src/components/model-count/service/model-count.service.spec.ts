import { Test, TestingModule } from '@nestjs/testing';
import { ModelCountService } from './model-count.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

class MockElasticSearchService{
    async query(index:string, query){
        return ['result']
    }
}

describe('ModelCountService', () => {
  	let service: ModelCountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			ModelCountService,
	  			{
	  				provide: ElasticSearchService,
	  				useClass: MockElasticSearchService
	  			}
	  		],
		}).compile();

		service = module.get<ModelCountService>(ModelCountService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
