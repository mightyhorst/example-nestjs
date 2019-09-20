import { Test, TestingModule } from '@nestjs/testing';
import { TopWebsitesByHitsService } from './top-websites-by-hits.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

import { PieChartDto } from '@responses/charts/index';

import { TimeRangeEnum } from '@enums/index';

import { exampleEsResponse } from './index';

const pieCharts = [
	new PieChartDto('Department', 233078),
	new PieChartDto('Non-Department', 712782)
]
class MockElasticSearchService{
    async query(index:string, query){
        return exampleEsResponse
    }
}
const mockConfig = {
    get: function(key){
        switch(key){
            case 'elasticsearch': {
                return { max_size: 10000 }
            }
        }
    }
}

describe('TopWebsitesByHitsService', () => {
  	let service: TopWebsitesByHitsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			TopWebsitesByHitsService,
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

		service = module.get<TopWebsitesByHitsService>(TopWebsitesByHitsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should search all top 20 websites ', async ()=>{

		const siteCode = 1234;
		const isDepartment = true;
		const size = 100;
		const timeRange = TimeRangeEnum.today;

		const resp = await service.search(
			siteCode, 
			isDepartment, 
			timeRange,
			size
		);

		expect(resp).toEqual(exampleEsResponse);
	})

	it('should return pie chart for top 20 websites ', async ()=>{
		const siteCode = 1234;
		const isDepartment = true;
		const size = 100;
		const timeRange = TimeRangeEnum.today;

		const resp = await service.searchToChart(
			siteCode, 
			isDepartment, 
			timeRange,
			size
		);

		expect(resp).toEqual(pieCharts);
	})

});
