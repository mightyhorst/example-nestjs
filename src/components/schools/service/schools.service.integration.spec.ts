import {Test, TestingModule} from '@nestjs/testing';
import { ConfigService } from 'nestjs-config';
import {SchoolsService} from './schools.service';
import {ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse} from '@services/services.module';

class MockElasticSearchService {
    async query(index: string, query) {
        return ['result'];
    }
}
const ESHOST = 'http://localhost:9200';
const mockConfig = {
    get: function(key){
        switch(key){
            case 'elasticsearch': {
                return { host: ESHOST }
            }
            default : {
                return { log: 'error' }
                
            }
        }
    }
}



if(process.env.NODE_ENV === 'integration'){
    describe('SchoolsService', async () => {

        it('should have the integration env up', async () => {
           
            const fetch = require('node-fetch');
            const res = await fetch(`${ESHOST}/ict_plus_school_data/_search?q=site_code:4268`);
            const json = await res.json();
            expect(json.hasOwnProperty('hits')).toEqual(true);

        });
        
               
        let service: SchoolsService;

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    SchoolsService,
                    ElasticSearchService,
                    /*{
                        provide: ElasticSearchService,
                        useClass: MockElasticSearchService,
                    },*/
                    {
                        provide: ConfigService,
                        useValue: mockConfig,
                    },
                ],
            }).compile();

            service = module.get<SchoolsService>(SchoolsService);
        });

        it('should be defined', () => {
            expect(service).toBeDefined();
        });

        it('should be able to find all records in a reasonable timeframe', async () => {
            const response = await service.findAll();
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
        });

        it('should be able to limit records', async () => {
            const response = await service.findAll(5);
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            expect(response.hits.hits).toHaveLength(5);
        });

        it('should be able to offset the limited records, i.e paging', async () => {
            const response = await service.findAll(5, 5);
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            expect(response.hits.hits).toHaveLength(5);
        });

        it('should be able to offset the limited records, i.e paging', async () => {
            const response = await service.findAll(5, 5);
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            expect(response.hits.hits).toHaveLength(5);
        });

        it('should be able to sort by a single field eg. site_suburb', async () => {
            const response = await service.findAll(1, 0, ['-site_suburb']);
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(20);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            expect(response.hits.hits).toHaveLength(1);
            expect(response.hits.hits[0]._source.site_suburb).toEqual('Yowie Bay'); // of course this wont always be true
        });

        it('should be able to filter by a simple value, site_postcode = 2228', async () => {
            const response = await service.findAll(1, 0, [], {site_postcode: '2228'});
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            expect(response.hits.hits).toHaveLength(1);
            expect(response.hits.hits[0]._source.site_postcode).toEqual('2228');
        });

        // it('should be able to perform a full text query using the `search` property', async () => {
        //     const response = await service.findAll(20, 0, [], {search: 'Abbotsf'});
        //     expect(response).not.toBeNull();
        //     expect(response.took).toBeLessThan(10);
        //     expect(response.timed_out).toEqual(false);
        //     expect(response.hits.hits).toBeInstanceOf(Array);
        //     expect(response.hits.hits).toHaveLength(20);
        //     // expect(response.hits.hits[0]["_source"]["release_year"]) be longer than 10 years ago
        // });

        it('should be able to find a single record by sitecode', async () => {
            const response = await service.findOne('1001');
            expect(response).not.toBeNull();
            expect(response.took).toBeLessThan(10);
            expect(response.timed_out).toEqual(false);
            expect(response.hits.hits).toBeInstanceOf(Array);
            const first = response.hits.hits[0]._source;
            expect(first.site_code).toEqual(1001);
            expect(first.site_name).toEqual('Abbotsford Public School');
        });


        
    });
}
else{
    describe('🙅‍♂️🙅‍♂️🙅‍♂️ Integration environment not running 🙅‍♂️🙅‍♂️🙅‍♂️', ()=>{

        it('should have the integration environment running', ()=>{})
    })
}