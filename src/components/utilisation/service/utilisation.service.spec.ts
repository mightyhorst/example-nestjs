import { Test, TestingModule } from '@nestjs/testing';
import { UtilisationService } from './utilisation.service';
import { 
	ElasticSearchService, 
	ElasticSearchRequest, 
	ElasticSearchResponse 
} from '@common/services/services.module';


/**
* @requires Types
**/
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes} from '@components/utilisation/types';
import { WarrantyTypes } from '@components/warranty/types';

// import * as DATA from '@mocks/utilisation/utilisation.sitecode.1809.json';
import * as DATA from '../../../../test/mocks/utilisation/utilisation.sitecode.1809.json';


class MockElasticSearchService{
    async query(index:string, query){
        return Promise.resolve(DATA.data);
    }
}

describe('UtilisationService', () => {
  	let service: UtilisationService;

  	var siteCode:number = 1809, 
		formFactor:string = 'Desktop', 
		warranty:WarrantyTypes = WarrantyTypes.covered,
		ageOfDevice:AgeRanges = '2_years_old',
		utilisation: UtilisationTypes = UtilisationTypes.last_week,
		model:string = 'Veriton S6630G', 
		size:number = 100;


	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
	  		providers: [
	  			UtilisationService,
	  			{
	  				provide: ElasticSearchService,
	  				useClass: MockElasticSearchService
	  			}
	  		],
		}).compile();

		service = module.get<UtilisationService>(UtilisationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('#search should have esQuery', async ()=>{

		it('#search should have esQuery siteCode, formFactor, warranty, ageOfDevice, utilisation, model, size', async () => {

			const search = await service.search(
				siteCode,
				formFactor,
				warranty,
				ageOfDevice,
				utilisation,
				model,
				size,
			)
			expect(search.esQuery.aggs).toEqual(
				{
					"utilisation_ranges": {
						"range": {
							"field": "last_logon_timestamp0", 
							"ranges": [
								{"from": "now-7d", "to": "now"}, 
								{"from": "now-15d", "to": "now-7d-1m"}, 
								{"from": "now-30d", "to": "now-15d-1m"}, 
								{"to": "now-30d-1m"}
							]
						}
					}
				},
			);

			expect(search.esQuery.query).toEqual(
				{
					"bool": {
						"must": [
								{"match": {"sitecode": 1809}}, 
								{"match": {"form_factor": "Desktop"}}, 
								{"range": {"warranty": {"from": "now+6M"}}
							}, 
							{
								"range": {
									"release_year": {"from": "now-2y", "to": "now-1y"}
								}
							}, 
							{
								"range": {
									"last_logon_timestamp0": {"from": "now-15d", "to": "now-7d-1m"}
								}
							}, 
							{
								"match": {"model": "Veriton S6630G"}
							}
						]
					}
				}
			);

			expect(search.esQuery.size).toEqual(100);

		});

		it('#search should have esQuery siteCode', async () => {

			const search = await service.search(
				siteCode,
				// formFactor,
				// warranty,
				// ageOfDevice,
				// utilisation,
				// model,
				// size,
			)

			expect(search.esQuery.aggs).toEqual({"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}});
			expect(search.esQuery.query).toEqual({
				"match": {"sitecode": 1809}
			});
			expect(search.esQuery.size).toEqual(10000);

		});

		it('#search should have esQuery siteCode, formFactor', async () => {

			const search = await service.search(
				siteCode,
				formFactor,
				// warranty,
				// ageOfDevice,
				// utilisation,
				// model,
				// size,
			)

			expect(search.esQuery.aggs).toEqual({
				"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}
			});
			expect(search.esQuery.query).toEqual(
				{"bool": {"must": [{"match": {"sitecode": 1809}}, {"match": {"form_factor": "Desktop"}}]}}
			);
			expect(search.esQuery.size).toEqual(10000);
			
		});

		it('#search should have esQuery siteCode, warranty', async () => {

			const search = await service.search(
				siteCode,
				null,
				warranty,
				// ageOfDevice,
				// utilisation,
				// model,
				// size,
			)

			expect(search.esQuery.aggs).toEqual(
				{"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}}
			);
			expect(search.esQuery.query).toEqual(
				{"bool": {"must": [{"match": {"sitecode": 1809}}, {"range": {"warranty": {"from": "now+6M"}}}]}}
			);
			expect(search.esQuery.size).toEqual(10000);
			
		});

		it('#search should have esQuery siteCode, ageOfDevice', async () => {

			const search = await service.search(
				siteCode,
				null,
				null,
				ageOfDevice,
				null,
				null,
				null,
			)

			expect(search.esQuery.aggs).toEqual(
				{"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}}
			);
			expect(search.esQuery.query).toEqual(
				{"bool": {"must": [{"match": {"sitecode": 1809}}, {"range": {"release_year": {"from": "now-2y", "to": "now-1y"}}}]}}
			);
			expect(search.esQuery.size).toEqual(10000);
			
		});

		it('#search should have esQuery siteCode, utilisation', async () => {

			const search = await service.search(
				siteCode,
				null,
				null,
				null,
				utilisation,
				null,
				null,
			)

			expect(search.esQuery.aggs).toEqual({"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}});
			expect(search.esQuery.query).toEqual({"bool": {"must": [{"match": {"sitecode": 1809}}, {"range": {"last_logon_timestamp0": {"from": "now-15d", "to": "now-7d-1m"}}}]}});
			expect(search.esQuery.size).toEqual(10000);
			
		});

		it('#search should have esQuery siteCode, model', async () => {

			const search = await service.search(
				siteCode,
				null, 
				null, 
				null, 
				null, 
				model,
				null, 
			)

			expect(search.esQuery.aggs).toEqual({"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}});
			expect(search.esQuery.query).toEqual({"bool": {"must": [{"match": {"sitecode": 1809}}, {"match": {"model": "Veriton S6630G"}}]}});
			expect(search.esQuery.size).toEqual(10000);
			
		});

		it('#search should have esQuery siteCode, size', async () => {

			const search = await service.search(
				siteCode,
				null, 
				null, 
				null, 
				null, 
				null, 
				size,
			)

			expect(search.esQuery.aggs).toEqual({"utilisation_ranges": {"range": {"field": "last_logon_timestamp0", "ranges": [{"from": "now-7d", "to": "now"}, {"from": "now-15d", "to": "now-7d-1m"}, {"from": "now-30d", "to": "now-15d-1m"}, {"to": "now-30d-1m"}]}}});
			expect(search.esQuery.query).toEqual({
				"match": {
					"sitecode": 1809
				}
			});
			expect(search.esQuery.size).toEqual(100);
			
		});

	})





	it('#search should have counts', async () => {

		const search = await service.search(
			siteCode,
			formFactor,
			warranty,
			ageOfDevice,
			utilisation,
			model,
			size,
		)
		expect(search.counts).toEqual({
			"matches": true, 
			"total": 212, 
			"utilisedIn15to30days": 0, 
			"utilisedIn7to15days": 0, 
			"utilisedInPast7days": 0, 
			"utilisedOver30days": 212
		});

		expect(search.counts.matches).toEqual(true);
		expect(search.counts.total).toEqual(212);
		expect(search.counts.utilisedIn15to30days).toEqual(0); 
		expect(search.counts.utilisedIn7to15days).toEqual(0); 
		expect(search.counts.utilisedInPast7days).toEqual(0); 
		expect(search.counts.utilisedOver30days).toEqual(212);		

	});

	it('#search should have hits', async () => {
		
		const search = await service.search(
			siteCode,
			formFactor,
			warranty,
			ageOfDevice,
			utilisation,
			model,
			size,
		)

		search.hits.hits.forEach(hit => {

			
			let keys = Object.keys( hit._source );

			// expect( keys ).toContain('ostype');
			expect( keys ).toContain('os_service_pack');
			expect( keys ).toContain('site_name');
			// expect( keys ).toContain('free_hdd_size_gb');
			expect( keys ).toContain('form_factor');
			expect( keys ).toContain('device_specification');
			expect( keys ).toContain('manufacturer');
			expect( keys ).toContain('device_name');
			expect( keys ).toContain('sitecode');
			expect( keys ).toContain('@timestamp');
			// expect( keys ).toContain('release_year');
			expect( keys ).toContain('warranty');
			expect( keys ).toContain('serialnumber');
			expect( keys ).toContain('resourceid');
			expect( keys ).toContain('operating_system');
			expect( keys ).toContain('model');
			expect( keys ).toContain('hdd_size_gb');
			expect( keys ).toContain('last_logon_timestamp0');
			// expect( keys ).toContain('total_memory_mb');
			expect( keys ).toContain('last_logon_user');
			expect( keys ).toContain('@version');
		})
		

		expect(search.hits.hits.length).toEqual(212);

	});

	it('#sums should sum up', async () => {
		
		var utilisedInPast7days = 0,
			utilisedIn7to15days = 0,
			utilisedIn15to30days = 0,
			utilisedOver30days = 0;

		const search = await service.search(
			siteCode,
			formFactor,
			warranty,
			ageOfDevice,
			utilisation,
			model,
			size,
		)
		search.hits.hits.forEach((item)=>{

			let lastLogin = new Date(item._source.last_logon_timestamp0);
			let today = new Date();
			let timeDiff = Math.abs(today.getTime() - lastLogin.getTime());
			let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

			if(diffDays <= 7) {
				utilisedInPast7days++;
			}
			else if(diffDays > 7 && diffDays <= 15) {
				utilisedIn7to15days++;
			}
			else if(diffDays > 15 && diffDays <= 30) {
				utilisedIn15to30days++;
			}
			else if(diffDays > 30) {
				utilisedOver30days++;
			}
		})

		expect(utilisedInPast7days).toEqual(0);
		expect(utilisedIn7to15days).toEqual(0);
		expect(utilisedIn15to30days).toEqual(0);
		expect(utilisedOver30days).toEqual(212);

	});

	it('should ', async () => {
		// expect(service).toEqual();
	});

	it('should ', async () => {
		// expect(service).toEqual();
	});
});
