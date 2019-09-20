// import { Test, TestingModule } from '@nestjs/testing';
// import { buildQuery, IAggregation, IRange } from './bodybuilder.service';
// import {WarrantyTypes} from '@components/warranty/types';
// import {UtilisationTypes} from '@components/utilisation/types';
// import {AgeRanges} from '@components/age/types';

// const bodybuilder = require('bodybuilder');

// describe.skip('body builder service', () => {
    
//     var expectedQuery = {
//         "query": {
//             "bool": {
//                 "must": [

//                     /**@param {number} siteCode **/
//                     {
//                         "match": {
//                             "sitecode": 1809
//                         }
//                     },


//                     /**@param {string} formFactor **/
//                     {
//                         "match": {
//                             "form_factor": "Desktop"
//                         }
//                     },


//                     /**@param {IRange} warranty **/
//                     {
//                         "range": {
//                             "warranty": {
//                                 "gt": "now-1y",
//                                 "lte": "now-1d"
//                             }
//                         }
//                     },

//                     /**@param {IRange} age **/              
//                     {
//                         "range": {
//                             "release_year": {
//                                 "gt": "now-1y",
//                                 "lte": "now-1d"
//                             }    
//                         }
//                     },

//                     /**@param {IRange} utilisation **/
//                     {
//                         "range": {
//                             "last_logon_timestamp0": {
//                                 "gt": "now-15d",
//                                 "lte": "now-7d"
//                             }
//                         }
//                     },

//                     /**@param {string} model **/
//                     {
//                         "match": {
//                             "model": "HP or whatever"
//                         }
//                     }
//                 ]
//             }
//         },
//             "aggs": {
//                 "form_factor_": {
//                 "terms": {
//                     "field": "form_factor"
//                 }
//             }
//         }
//     }

//     it('#bodybuilder should create a elastic search query json', () => {
//         let esReq = bodybuilder()
//             .query('match', 'sitecode', 1809) 
//             .query('match', 'form_factor', 'Desktop')
//             .query('range', 'warranty', {"gt" : "now-1y", "lte" :  "now-1d"})
//             .query('range', 'release_year', {"gt" : "now-1y", "lte" :  "now-1d"})
//             .query('range', 'last_logon_timestamp0', {"gt" : "now-15d", "lte" :  "now-7d"})
//             .query('match', 'model', 'HP or whatever')
//             .aggregation('terms', 'form_factor', 'form_factor_')
//             .build()

//         expect(esReq).toEqual(expectedQuery);
//     });

//     it.only('#buildQuery "all" - should build the elastic search query json', ()=>{
        
//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      siteCode: 1809,
//             /**@param {IAggregation} agg **/     agg?: <IAggregation>{name: 'form_factor_', field: 'form_factor'}, ,
//             /**@param {string} formFactor **/    formFactor?: 'Desktop',
//             /**@param {IRange} warranty **/      warranty?: WarrantyTypes.expired,
//             /**@param {IRange} age **/           age?: AgeRanges.1_year_old,
//             /**@param {IRange} utilisation **/   utilisation?: UtilisationTypes.several_weeks_ago,
//             /**@param {string} model **/         model?: 'HP or whatever',
//             /**@param {number} size **/          size?: 100,
//             /**@param {number} fromIndex **/     fromIndex?: null,
//             /**@param {number} toIndex **/       toIndex?: null,
//             /**@param {ISort[]} sort **/         sort?: null
//         );


//         expect(esReq).toEqual(expectedQuery);

//     })

//     it('#buildQuery "aggregation" only - should only build query with aggreagtion', ()=>{

//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809, 
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    null,
//             /**@param {IRange} warranty **/      null,
//             /**@param {IRange} age **/           null,
//             /**@param {IRange} utilisation **/   null,
//             /**@param {string} model **/         null,
//             /**@param {number} size **/          null,
//         );

//         var expectedQuery = {
//             "query": 
                
//                 /**@param {number} siteCode **/
//                 {
//                     "match": {
//                         "sitecode": 1809
//                     }
//                 }
                
//             ,
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }
//         expect(esReq).toEqual(expectedQuery);

//     })

//     it('#buildQuery "formfactor" only - should only build query with form factor', ()=>{

//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809, 
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    'Desktop', 
//             /**@param {IRange} warranty **/      null,
//             /**@param {IRange} age **/           null,
//             /**@param {IRange} utilisation **/   null,
//             /**@param {string} model **/         null, 
//             /**@param {number} size **/          100
//         );

//         var expectedQuery = {
//             "query": {
//                 "bool": {
//                     "must": [

//                         /**@param {number} siteCode **/
//                         {
//                             "match": {
//                                 "sitecode": 1809
//                             }
//                         },

//                         /**@param {string} formFactor **/
//                         {
//                             "match": {
//                                 "form_factor": "Desktop"
//                             }
//                         },
//                     ],
//                 }
//             },
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }

//         expect(esReq).toEqual(expectedQuery);

//     })

//     it('#buildQuery "warranty" only - should only build query with warranty', ()=>{

//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809, 
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    null,
//             /**@param {IRange} warranty **/      <IRange>{"gt" : "now-1y", "lte" :  "now-1d"}, 
//             /**@param {IRange} age **/           null,
//             /**@param {IRange} utilisation **/   null,
//             /**@param {string} model **/         null,
//             /**@param {number} size **/          null,
//         );

//         var expectedQuery = {
//             "query": {
//                 "bool": {
//                     "must": [

//                         /**@param {number} siteCode **/
//                         {
//                             "match": {
//                                 "sitecode": 1809
//                             }
//                         },
                        
//                         /**@param {IRange} warranty **/
//                         {
//                             "range": {
//                                 "warranty": {
//                                     "gt": "now-1y",
//                                     "lte": "now-1d"
//                                 }
//                             }
//                         },
//                     ],
//                 }
//             },
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }

//         expect(esReq).toEqual(expectedQuery);

//     })

//     it('#buildQuery "age" only - should only build query with last_logon_timestamp0', ()=>{
        
//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809, 
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    null,
//             /**@param {IRange} warranty **/      null,
//             /**@param {IRange} age **/           <IRange>{"gt" : "now-15d", "lte" :  "now-7d"},
//             /**@param {IRange} utilisation **/   null,
//             /**@param {string} model **/         null,
//             /**@param {number} size **/          null,
//         );

//         var expectedQuery = {
//             "query": {
//                 "bool": {
//                     "must": [

//                         /**@param {number} siteCode **/
//                         {
//                             "match": {
//                                 "sitecode": 1809
//                             }
//                         },
                        
//                         /**@param {IRange} age **/              
//                         {
//                             "range": {
//                                 "release_year": {
//                                     "gt": "now-15d",
//                                     "lte": "now-7d"
//                                 }    
//                             }
//                         },
//                     ],
//                 }
//             },
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }

//         expect(esReq).toEqual(expectedQuery);
//     })

//     it('#buildQuery "utilisation" only - should only build query with release_year', ()=>{
        
//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809,
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    null,
//             /**@param {IRange} warranty **/      null,
//             /**@param {IRange} age **/           null,
//             /**@param {IRange} utilisation **/   <IRange>{"gt" : "now-1y", "lte" :  "now-1d"},
//             /**@param {string} model **/         null,
//             /**@param {number} size **/          null,
//         );

//         var expectedQuery = {
//             "query": {
//                 "bool": {
//                     "must": [

//                         /**@param {number} siteCode **/
//                         {
//                             "match": {
//                                 "sitecode": 1809
//                             }
//                         },
                        
//                        /**@param {IRange} utilisation **/
//                        {
//                            "range": {
//                                "last_logon_timestamp0": {
//                                    "gt": "now-1y",
//                                    "lte": "now-1d"
//                                }
//                            }
//                        },
//                     ],
//                 }
//             },
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }

//         expect(esReq).toEqual(expectedQuery);
//     })

//     it('#buildQuery "model" only - should only build query with model', ()=>{

//         let esReq = buildQuery(
//             /**@param {number} siteCode **/      1809, 
//             /**@param {IAggregation} agg **/     <IAggregation>{name: 'form_factor_', field: 'form_factor'}, 
//             /**@param {string} formFactor **/    null,
//             /**@param {IRange} warranty **/      null,
//             /**@param {IRange} age **/           null,
//             /**@param {IRange} utilisation **/   null,
//             /**@param {string} model **/         'HP or whatever', 
//             /**@param {number} size **/          null
//         );

//         var expectedQuery = {
//             "query": {
//                 "bool": {
//                     "must": [

//                         /**@param {number} siteCode **/
//                         {
//                             "match": {
//                                 "sitecode": 1809
//                             }
//                         },
                        
//                         /**@param {string} model **/
//                         {
//                             "match": {
//                                 "model": "HP or whatever"
//                             }
//                         }
//                     ],
//                 }
//             },
//             "aggs": {
//                 "form_factor_": {
//                     "terms": {
//                         "field": "form_factor"
//                     }
//                 }
//             }
//         }

//         expect(esReq).toEqual(expectedQuery);

//     })
// });
