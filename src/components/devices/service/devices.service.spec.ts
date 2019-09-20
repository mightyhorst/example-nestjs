import {Test, TestingModule} from '@nestjs/testing';
import {DevicesService} from './devices.service';
import {ElasticSearchService, ElasticSearchRequest, ElasticSearchResponse} from '@services/services.module';

class MockElasticSearchService {
    async query(index: string, query) {
        return ['result'];
    }
}

describe('DevicesService', () => {
    let service: DevicesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DevicesService,
                ElasticSearchService,
                // {
                // 	provide: ElasticSearchService,
                // 	useClass: MockElasticSearchService
                // }
            ],
        }).compile();

        service = module.get<DevicesService>(DevicesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get a count of devices from elastic without returning any devices themselves', async () => {
        const response = await service.count(1809);
        expect(response).not.toBeNull();
    });

    it('should be able to find all records in a reasonable timeframe', async () => {
        const response = await service.search(1809);
        expect(response).not.toBeNull();
        expect(response.took).toBeLessThan(10);
        expect(response.timed_out).toEqual(false);
        expect(response.hits.hits).toBeInstanceOf(Array);
    });

    it('should be able to limit records', async () => {
        const response = await service.search(1809, null, null, null, null, 5);
        expect(response).not.toBeNull();
        expect(response.took).toBeLessThan(10);
        expect(response.timed_out).toEqual(false);
        expect(response.hits.hits).toBeInstanceOf(Array);
        expect(response.hits.hits).toHaveLength(5);
    });

    // it('should be able to offset the limited records, i.e paging', async () => {
    //     const response = await service.search(1809, null, null, null, null, 5, 5);
    //     expect(response).not.toBeNull();
    //     expect(response.took).toBeLessThan(10);
    //     expect(response.timed_out).toEqual(false);
    //     expect(response.hits.hits).toBeInstanceOf(Array);
    //     expect(response.hits.hits).toHaveLength(5);
    // });

    // it('should be able to sort by a single field', async () => {
    //     const response = await service.search(1, 0, ['-sitecode']);
    //     expect(response).not.toBeNull();
    //     expect(response.took).toBeLessThan(20);
    //     expect(response.timed_out).toEqual(false);
    //     expect(response.hits.hits).toBeInstanceOf(Array);
    //     expect(response.hits.hits).toHaveLength(1);
    //     expect(response.hits.hits[0]._source.sitecode).toEqual('9996'); // of course this wont always be true
    // });
    //
    // it('should be able to filter by a simple value, model = ThinkCentre M92p', async () => {
    //     const response = await service.search(1, 0, [], {model: 'ThinkCentre M92p'});
    //     expect(response).not.toBeNull();
    //     expect(response.took).toBeLessThan(10);
    //     expect(response.timed_out).toEqual(false);
    //     expect(response.hits.hits).toBeInstanceOf(Array);
    //     expect(response.hits.hits).toHaveLength(1);
    //     expect(response.hits.hits[0]._source.model).toEqual('ThinkCentre M92p');
    // });
    //
    // it('should be able to generate greater than / less than queries for time ranges specified as elastic date math expressions, age = 10y', async () => {
    //     const response = await service.search(20, 0, [], {age: '10y'});
    //     expect(response).not.toBeNull();
    //     expect(response.took).toBeLessThan(10);
    //     expect(response.timed_out).toEqual(false);
    //     expect(response.hits.hits).toBeInstanceOf(Array);
    //     expect(response.hits.hits).toHaveLength(20);
    //     // expect(response.hits.hits[0]["_source"]["release_year"]) be longer than 10 years ago
    // });
});
