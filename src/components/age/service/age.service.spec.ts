import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'nestjs-config';
import { AgeService } from './age.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

class MockElasticSearchService{
    async query(index:string, query){
        return ['result']
    }
}

const mockConfig = {
	/** @todo mock config **/
}

describe('AgeService', () => {
  	let service: AgeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			AgeService,
	  			{
	  				provide: ElasticSearchService,
	  				useClass: MockElasticSearchService
	  			},
	  			{
	  				provide: ConfigService,
	  				useValue: mockConfig
	  			}
	  		],
		}).compile();

		service = module.get<AgeService>(AgeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
