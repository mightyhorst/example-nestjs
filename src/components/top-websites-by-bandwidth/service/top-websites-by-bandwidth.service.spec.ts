import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'nestjs-config';
import { TopWebsitesByBandwidthService } from './top-websites-by-bandwidth.service';
import { ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse } from '@services/services.module';

import { PieChartDto } from '@responses/charts/index';
import { TimeRangeEnum } from '@enums/index';
import { exampleEsResponse } from './index';

const pieCharts = [
	new PieChartDto('Department', 16309155523),
	new PieChartDto('Non-Department', 47708860822)
]
class MockElasticSearchService{
    async query(index:string, query){
        return exampleEsResponse
    }
}
const mockConfig = {
	get:function(key){		
		return {
			max_size:10000
		}
	}
}

describe('TopWebsitesByBandwidthService', () => {
  	let service: TopWebsitesByBandwidthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			TopWebsitesByBandwidthService,
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

		service = module.get<TopWebsitesByBandwidthService>(TopWebsitesByBandwidthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should search all top-websites-by-bandwidth ', async ()=>{

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

	it('should return pie chart for top-websites-by-bandwidth ', async ()=>{
		const siteCode = 1234;
		const isDepartment = true;
		const size = 100;
		const timeRange = TimeRangeEnum.today;

		const resp = await service.searchToPieChart(
			siteCode, 
			isDepartment, 
			timeRange,
			size
		);

		expect(resp).toEqual(pieCharts);
	})

});

