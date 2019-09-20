import { getDeptAgg, getTimeFilter, getDeptQueryString } from '@requests/index';
import { TimeRangeEnum } from '@enums/index';
import {log,
   error,
   warn,
   debug,
   verbose
} from '@utils/index';

export function buildEsQueryForPieChart(
   siteCode:number, 
   isDepartment?: boolean,
   timeRange?: TimeRangeEnum,
   size?:number
){

   let query;
   if(timeRange){
      query = {
         "bool":{
            "must":[
               {
                   "range": {
                       "@timestamp": getTimeFilter(timeRange)
                   }
               },
               {
                  "match":{
                     "sitecode":siteCode
                  }
               }
            ]
         }
      }
   }
   else{
      query = {
         "match":{
            "sitecode":siteCode
         }
      }
   }

   var esQuery = {
      "size":0,
      "query": query,
      "aggs":{
         "Websites":{
            "filters":getDeptAgg(isDepartment),
            "aggs":{
               "total_hit_counts":{
                  "sum":{
                     "field":"total_bytes_received"
                  }
               }
            }
         }
      }
   }

   return esQuery;
}


export function buildEsQueryForBarChart(
   siteCode:number, 
   isDepartment?: boolean,
   timeRange?: TimeRangeEnum,
   size?:number
){

   let query;
   if(timeRange){
      query = {
         'bool':{
            'must':[
               {
                  "query_string": getDeptQueryString(isDepartment)
               },
               {
                   "range": {
                       "@timestamp": getTimeFilter(timeRange)
                   }
               },
               {
                  "match":{
                     "sitecode":siteCode
                  }
               }
            ]
         }
      }
   }
   else{
      query = {
         'bool':{
            'must':[
               {
                  "query_string": getDeptQueryString(isDepartment)
               },
               {
                  "match":{
                     "sitecode":siteCode
                  }
               }
            ]
         }
      }
   }

   const esQuery = {
      "size": size ? size : 10000,
      "query": query,
      "aggs":{
         "top_website":{
            "terms":{
               "field":"sitehost.keyword",
               "order":{
                  "total_traffic":"desc"
               }
            },
            "aggs":{
               "total_traffic":{
                  "sum":{
                     "field":"total_bytes_received"
                  }
               }
            }
         }
      }
   }
   console.log('buildEsQueryForBarChart.esQuery --->', esQuery)
   return esQuery;
}
