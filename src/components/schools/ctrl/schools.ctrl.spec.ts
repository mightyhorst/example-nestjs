import {Test, TestingModule} from '@nestjs/testing';
import {SchoolsController} from './schools.ctrl';
import {SchoolsService} from '../service/schools.service';
import {ElasticSearchResponse} from '@services/elastic-search/dto/es-response';
import {ElasticSearchService} from '@services/elastic-search/elastic-search.service';

class MockService {
    async findOne(siteCode: string = '1001'): Promise<ElasticSearchResponse> {
        return {
            took: 0,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                skipped: 0,
                failed: 0,
            },
            hits: {
                total: 1,
                max_score: 1,
                hits: [
                    {
                        _index: 'ict_plus_school_data',
                        _type: '_doc',
                        _id: '1001Abbotsford Public School',
                        _score: 1,
                        _source: {
                            '_links': {
                                self: {
                                    href: 'https://bud.apps.det.nsw.edu.au/api/v1/sites?per-page=0&page=1',
                                },
                            },
                            'site_principal_network': 'Iron Cove',
                            'site_operational_directorate': 'Metropolitan South',
                            '_meta': {
                                currentPage: 1,
                                totalCount: 2681,
                                perPage: 0,
                                pageCount: 1,
                            },
                            'site_suburb': 'Abbotsford',
                            'site_code': 1001,
                            'site_name': 'Abbotsford Public School',
                            'site_enrolments': 607,
                            'site_street': '350 Great North Rd',
                            'site_postcode': '2046',
                            'site_principal_name': 'Johnson, Christine',
                            'site_email': 'abbotsford-p.school@det.nsw.edu.au',
                            '@timestamp': '2019-03-18T04:22:12.253Z',
                            'site_phone': '9713 6220',
                            '@version': '1',
                        },
                    },
                ],
            },
        };
    }
}

describe('Schools Controller', () => {
    let controller: SchoolsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SchoolsController],
            providers: [
                SchoolsService,
                ElasticSearchService,
                // {
                //     provide: SchoolsService,
                //     useClass: MockService,
                // },
            ],
        }).compile();

        controller = module.get<SchoolsController>(SchoolsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return a single result when fetching one school by sitecode', async () => {
        const response = await controller.findOne('1001');
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('hits');
        expect(response.data.hits).toHaveProperty('hits');
        expect(response.data.hits.hits[0]._source.site_code).toEqual(1001);
    });

    it('should return a list of schools, limited by the limit parameter', async () => {
        const response = await controller.findAll(15, 0, [], {});
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('hits');
        expect(response.data.hits).toHaveProperty('hits');
        expect(response.data.hits.hits).toHaveLength(15);
    });

    it('should be able to sort by site_postcode', async () => {
        const response = await controller.findAll(1, 0, ['site_postcode'], {});
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('hits');
        expect(response.data.hits).toHaveProperty('hits');
        expect(response.data.hits.hits).toHaveLength(1);
        expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
    });

    it('should be able to filter by basic attributes eg. site_code = 283', async () => {
        const response = await controller.findAll(1, 0, [], {site_code: '283'});
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('hits');
        expect(response.data.hits).toHaveProperty('hits');
        expect(response.data.hits.hits).toHaveLength(1);
        expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
    });

    it('should be able to filter by basic attributes eg. site_code = 283', async () => {
        const response = await controller.findAll(1, 0, [], {site_code: '283'});
        expect(response).toHaveProperty('data');
        expect(response.data).toHaveProperty('hits');
        expect(response.data.hits).toHaveProperty('hits');
        expect(response.data.hits.hits).toHaveLength(1);
        expect(response.data.hits.hits[0]._source.site_code).toEqual(283);
    });
});
