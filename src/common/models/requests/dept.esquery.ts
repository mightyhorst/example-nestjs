import { TimeRangeEnum } from '@enums/index';


export function getDeptQueryString(isDepartment:boolean){

    let query:string;
    if(isDepartment){
        query = "sitehost:*.1e100.net OR sitehost:accounts.google.* OR sitehost:accounts.gstatic.com OR sitehost:accounts.youtube.com OR sitehost:alt*.gstatic.com3 OR sitehost:chromeos-ca.gstatic.com OR sitehost:clients1.google.com OR sitehost:clients2.google.com OR sitehost:clients3.google.com OR sitehost:clients4.google.com OR sitehost:commondatastorage.googleapis.com OR sitehost:cros-omahaproxy.appspot.com OR sitehost:dl.google.com OR sitehost:dl-ssl.google.com OR sitehost:*.gvt1.com OR sitehost:gweb-gettingstartedguide.appspot.com OR sitehost:m.google.com OR sitehost:omahaproxy.appspot.com OR sitehost:pack.google.com OR sitehost:policies.google.com OR sitehost:safebrowsing-cache.google.com OR sitehost:safebrowsing.google.com OR sitehost:ssl.gstatic.com OR sitehost:storage.googleapis.com OR sitehost:tools.google.com OR sitehost:www.googleapis.com OR sitehost:www.gstatic.com OR sitehost:sc.microsoft.com.nsatc.net OR sitehost:windowsupdate.microsoft.com OR sitehost:*.windowsupdate.microsoft.com OR sitehost:*.update.microsoft.com OR sitehost:*.windowsupdate.com OR sitehost:download.windowsupdate.com OR sitehost:download.microsoft.com OR sitehost:*.download.windowsupdate.com OR sitehost:wustat.windows.com OR sitehost:ntservicepack.microsoft.com OR sitehost:go.microsoft.com OR sitehost:officecdn.microsoft.com OR sitehost:officecdn.microsoft.com.edgesuite.net OR sitehost:config.office.com OR sitehost:*akamaiedge.net OR sitehost:*.manage.microsoft.com OR sitehost:go.microsoft.com OR sitehost:blob.core.windows.net OR sitehost:download.microsoft.com OR sitehost:sccmconnected-a01.cloudapp.net OR sitehost:silverlight.dlservice.microsoft.com OR sitehost:*.manage.microsoft.com OR sitehost:bspmts.mp.microsoft.com OR sitehost:login.microsoftonline.com OR sitehost:download.microsoft.com  OR sitehost:*.core.windows.net OR sitehost:*.cloudapp.net OR sitehost:bspmts.mp.microsoft.com OR sitehost:login.microsoftonline.com OR sitehost:login.windows.net OR sitehost:has.spserv.microsoft.com OR sitehost:wdcp.microsoft.com OR sitehost:wdcpalt.microsoft.com OR sitehost:has.spserv.microsoft.com OR sitehost:albert.apple.com OR sitehost:iprofiles.apple.com OR sitehost:crl3.digicert.com OR sitehost:crl4.digicert.com OR sitehost:ocsp.digicert.com";
    }
    else{
        query = "!(sitehost: (*.1e100.net) OR sitehost: (accounts.google.*) OR sitehost:  (accounts.gstatic.com) OR sitehost:  (accounts.youtube.com) OR sitehost:  (alt*.gstatic.com3) OR sitehost:  (chromeos-ca.gstatic.com) OR sitehost:  (clients1.google.com) OR sitehost:  (clients2.google.com) OR sitehost:  (clients3.google.com) OR sitehost:  (clients4.google.com) OR sitehost:  (commondatastorage.googleapis.com) OR sitehost:  (cros-omahaproxy.appspot.com) OR sitehost:  (dl.google.com) OR sitehost:  (dl-ssl.google.com) OR sitehost:  (*.gvt1.com) OR sitehost:  (gweb-gettingstartedguide.appspot.com) OR sitehost:  (m.google.com) OR sitehost:  (omahaproxy.appspot.com) OR sitehost:  (pack.google.com) OR sitehost:  (policies.google.com) OR sitehost:  (safebrowsing-cache.google.com) OR sitehost:  (safebrowsing.google.com) OR sitehost:  (ssl.gstatic.com) OR sitehost:  (storage.googleapis.com) OR sitehost:  (tools.google.com) OR sitehost:  (www.googleapis.com) OR sitehost:  (www.gstatic.com) OR sitehost:  (sc.microsoft.com.nsatc.net) OR sitehost:  (windowsupdate.microsoft.com) OR sitehost:  (*.windowsupdate.microsoft.com) OR sitehost:  (*.update.microsoft.com) OR sitehost:  (*.windowsupdate.com) OR sitehost:  (download.windowsupdate.com) OR sitehost:  (download.microsoft.com) OR sitehost:  (*.download.windowsupdate.com) OR sitehost:  (wustat.windows.com) OR sitehost:  (ntservicepack.microsoft.com) OR sitehost:  (go.microsoft.com) OR sitehost:  (officecdn.microsoft.com) OR sitehost:  (officecdn.microsoft.com.edgesuite.net) OR sitehost:  (config.office.com) OR sitehost:  (*akamaiedge.net) OR sitehost:  (*.manage.microsoft.com) OR sitehost:  (go.microsoft.com) OR sitehost:  (blob.core.windows.net) OR sitehost:  (download.microsoft.com) OR sitehost:  (sccmconnected-a01.cloudapp.net) OR sitehost:  (silverlight.dlservice.microsoft.com) OR sitehost:  (*.manage.microsoft.com) OR sitehost:  (bspmts.mp.microsoft.com) OR sitehost:  (login.microsoftonline.com) OR sitehost:  (download.microsoft.com) OR sitehost:  (go.microsoft.com) OR sitehost:  (*.core.windows.net) OR sitehost:  (*.cloudapp.net) OR sitehost:  (bspmts.mp.microsoft.com) OR sitehost:  (login.microsoftonline.com) OR sitehost:  (login.windows.net) OR sitehost:  (has.spserv.microsoft.com) OR sitehost:  (wdcp.microsoft.com) OR sitehost:  (wdcpalt.microsoft.com) OR sitehost:  (has.spserv.microsoft.com) OR sitehost:  (albert.apple.com) OR sitehost:  (iprofiles.apple.com) OR sitehost:  (crl3.digicert.com) OR sitehost:  (crl4.digicert.com) OR sitehost:  (ocsp.digicert.com))";
    }

    return {
        "query":query,
        "analyze_wildcard":true,
        "default_field":"*"
    }
}


export interface ITimeQuery{
    gt?:string;
    lt?:string;
    lte?:string;
    gte?:string;
}
export function getTimeFilter(timeFilter?: TimeRangeEnum):ITimeQuery{
    
    let timeQuery:ITimeQuery;

    switch(timeFilter){
        case TimeRangeEnum.today:
            timeQuery = {
                gt: "now-1d",
                lte: "now"
            }
            break;
        case TimeRangeEnum.yesterday:
            timeQuery = {
                gt: "now-2d",
                lte: "now-1d"
            }
            break;
        case TimeRangeEnum.thisweek:
            timeQuery = {
                gt: "now-7d",
                lte: "now"
            }
            break;
        case TimeRangeEnum.thismonth:
            timeQuery = {
                gt: "now-30d",
                lte: "now"
            }
            break;
        default:
            timeQuery = {
                gt: "now-30d",
                lte: "now"
            }
            break;
    }

    return timeQuery;
}


/**
* @param isDepartment - this is ignored for the Hits query as the aggregation is needed for both dept and non-dept 
**/
export function getDeptAgg(isDepartment?:boolean){

    if(isDepartment === true){
        console.log('@todo - filter by department');
    }
    else if(isDepartment === false){
        console.log('@todo - filter by non department');
    }
    else if(isDepartment === null || isDepartment == undefined){
        console.log('@todo - no filter by department or non-department supplied');
    }

   return {
      "other_bucket_key":"non-department",
      "filters":{
         "department":{
            "bool":{
               "should":[
                  {
                     "wildcard":{
                        "sitehost":"*.1e100.net"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"accounts.google.*"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"accounts.gstatic.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"accounts.youtube.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"alt*.gstatic.com3"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"chromeos-ca.gstatic.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"clients1.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"clients2.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"clients3.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"clients4.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"commondatastorage.googleapis.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"cros-omahaproxy.appspot.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"dl.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"dl-ssl.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"*.gvt1.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"gweb-gettingstartedguide.appspot.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"m.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"omahaproxy.appspot.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"pack.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"policies.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"safebrowsing-cache.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"safebrowsing.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"ssl.gstatic.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"storage.googleapis.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"tools.google.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"www.googleapis.com"
                     }
                  },
                  {
                     "wildcard":{
                        "sitehost":"www.gstatic.com"
                     }
                  },

                  {
                      "wildcard":{
                         "sitehost":"sc.microsoft.com.nsatc.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"windowsupdate.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.windowsupdate.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.update.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.windowsupdate.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"download.windowsupdate.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"download.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.download.windowsupdate.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"wustat.windows.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"ntservicepack.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"go.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"officecdn.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"officecdn.microsoft.com.edgesuite.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"config.office.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*akamaiedge.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.manage.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"go.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"blob.core.windows.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"download.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"sccmconnected-a01.cloudapp.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"silverlight.dlservice.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.manage.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"bspmts.mp.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"login.microsoftonline.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"download.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"go.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.core.windows.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"*.cloudapp.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"bspmts.mp.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"login.microsoftonline.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"login.windows.net"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"has.spserv.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"wdcp.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"wdcpalt.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"has.spserv.microsoft.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"albert.apple.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"iprofiles.apple.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"crl3.digicert.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"crl4.digicert.com"
                      }
                   },
                   {
                      "wildcard":{
                         "sitehost":"ocsp.digicert.com"
                      }
                   }
               ]
            }
         }
      }
   }
}