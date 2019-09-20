import { getDeptAgg, getTimeFilter } from '@requests/index';
import { TimeRangeEnum } from '@enums/index';

/**
* @param isDepartment - this is ignored for the Hits query as the aggregation is needed for both dept and non-dept 
**/
export function buildEsQuery(
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
                     "field":"num_site_req"
                  }
               }
            }
         }
      }
   }

   return esQuery;
}
