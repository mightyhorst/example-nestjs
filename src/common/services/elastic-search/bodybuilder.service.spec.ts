import { Test, TestingModule } from '@nestjs/testing';
import { buildQuery, IAggregation, IRange } from './bodybuilder.service';
import {WarrantyTypes} from '@components/warranty/types';
import {UtilisationTypes} from '@components/utilisation/types';
import {AgeRanges} from '@components/age/types';

const bodybuilder = require('bodybuilder');

describe.skip('body builder service', () => {
    
    var TODOexpectedQuery = {
        "query": {
            "bool": {
                "must": [

                    /**@param {number} siteCode **/
                    {
                        "match": {
                            "sitecode": 1809
                        }
                    },


                    /**@param {string} formFactor **/
                    {
                        "match": {
                            "form_factor": "Desktop"
                        }
                    },


                    /**@param {IRange} warranty **/
                    {
                        "range": {
                            "warranty": {
                                "gt": "now-1y",
                                "lte": "now-1d"
                            }
                        }
                    },

                    /**@param {IRange} age **/              
                    {
                        "range": {
                            "release_year": {
                                "gt": "now-1y",
                                "lte": "now-1d"
                            }    
                        }
                    },

                    /**@param {IRange} utilisation **/
                    {
                        "range": {
                            "last_logon_timestamp0": {
                                "gt": "now-15d",
                                "lte": "now-7d"
                            }
                        }
                    },

                    /**@param {string} model **/
                    {
                        "match": {
                            "model": "HP or whatever"
                        }
                    }
                ]
            }
        },
            "aggs": {
                "form_factor_": {
                "terms": {
                    "field": "form_factor"
                }
            }
        }
    }
    var expectedQuery = {"aggs": {"form_factor_": {"terms": {"field": "form_factor", "size": 100}}}, "query": {"bool": {"must": [{"match": {"sitecode": 1809}}, {"match": {"form_factor": "Desktop"}}, {"range": {"warranty": {"to": "now"}}}, {"range": {"release_year": {"from": "now-1y"}}}, {"range": {"last_logon_timestamp0": {"from": "now-30d", "to": "now-15d-1m"}}}, {"match": {"model": "HP or whatever"}}]}}, "size": 100}

    it('#bodybuilder should create a elastic search query json', () => {
        let esReq = bodybuilder()
            .query('match', 'sitecode', 1809) 
            .query('match', 'form_factor', 'Desktop')
            .query('range', 'warranty', {"gt" : "now-1y", "lte" :  "now-1d"})
            .query('range', 'release_year', {"gt" : "now-1y", "lte" :  "now-1d"})
            .query('range', 'last_logon_timestamp0', {"gt" : "now-15d", "lte" :  "now-7d"})
            .query('match', 'model', 'HP or whatever')
            .aggregation('terms', 'form_factor', 'form_factor_')
            .build()

        expect(esReq).toEqual(expectedQuery);
    });

    it('#buildQuery "all" - should build the elastic search query json', ()=>{
        
        let esReq = buildQuery(
            /**@param {number} siteCode **/      1809,
            /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'},
            /**@param {string} formFactor **/    'Desktop',
            /**@param {IRange} warranty **/      WarrantyTypes.expired,
            /**@param {IRange} age **/           '1_year_old',
            /**@param {IRange} utilisation **/   UtilisationTypes.several_weeks_ago,
            /**@param {string} model **/         'HP or whatever',
            /**@param {number} size **/          100,
            /**@param {number} fromIndex **/     null,
            /**@param {number} toIndex **/       null,
            /**@param {ISort[]} sort **/         null
        );


        expect(esReq).toEqual(expectedQuery);

    })

});
