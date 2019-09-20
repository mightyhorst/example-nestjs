import { Test, TestingModule } from '@nestjs/testing';
import { ElasticSearchService } from './bodybuilder.service';

const bodybuilder = require('bodybuilder');

describe('ElasticSearchService', () => {
    let service: ElasticSearchService;

    beforeEach(async () => {
        service = module.get<ElasticSearchService>(ElasticSearchService);
    });

    it('should be defined', () => {
    expect(service).toBeDefined();
    });


    it('should create a body builder json', () => {
        let esReq = bodybuilder()
            .query('match', 'sitecode', 1809)
            .query('match', 'form_factor', 'Desktop')
            .query('range', 'warranty', {"gt" : "now-1y", "lte" :  "now-1d"})
            .query('range', 'last_logon_timestamp0', {"gt" : "now-15d", "lte" :  "now-7d"})
            .query('range', 'release_year', {"gt" : "now-1y", "lte" :  "now-1d"})
            .query('match', 'model', 'HP or whatever')
            .aggregation('terms', 'user')
            .build();

        expect(esReq).toEqual(
            {
              "query": {
                "bool": {
                  "must": [
                    {
                      "match": {
                        "sitecode": 1809
                      }
                    },
                    {
                      "match": {
                        "form_factor": "Desktop"
                      }
                    },
                    {
                      "range": {
                        "warranty": {
                          "gt": "now-1y",
                          "lte": "now-1d"
                        }
                      }
                    },
                    {
                      "range": {
                        "last_logon_timestamp0": {
                          "gt": "now-15d",
                          "lte": "now-7d"
                        }
                      }
                    },
                    {
                      "range": {
                        "release_year": {
                          "gt": "now-1y",
                          "lte": "now-1d"
                        }
                      }
                    },
                    {
                      "match": {
                        "model": "HP or whatever"
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "agg_terms_user": {
                  "terms": {
                    "field": "user"
                  }
                }
              }
            }
        );
    });
});
