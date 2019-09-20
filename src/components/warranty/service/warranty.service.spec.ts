import { Test, TestingModule } from '@nestjs/testing';
import { WarrantyService } from './warranty.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

class MockElasticSearchService{
    async query(index:string, query){
        return ['result']
    }
}

describe('WarrantyService', () => {
  	let service: WarrantyService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			WarrantyService,
	  			{
	  				provide: ElasticSearchService,
	  				useClass: MockElasticSearchService,
	  			},
	  		],
		}).compile();

		service = module.get<WarrantyService>(WarrantyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
