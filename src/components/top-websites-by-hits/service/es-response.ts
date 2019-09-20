interface IDept{
	"doc_count": number;
	"total_hit_counts": any
}

export interface IBucket{
	department: IDept;
	"non-department": IDept;
}

interface IWebsite{
	buckets: IBucket; 
}

export interface IWebsiteAggregation {
	Websites: IWebsite;
}

export const exampleEsResponse = {
    "took": 139,
    "timed_out": false,
    "_shards": {
        "total": 5,
        "successful": 5,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": 53903,
        "max_score": 0,
        "hits": []
    },
    "aggregations": {
        "Websites": {
            "buckets": {
                "department": {
                    "doc_count": 6916,
                    "total_hit_counts": {
                        "value": 233078
                    }
                },
                "non-department": {
                    "doc_count": 46987,
                    "total_hit_counts": {
                        "value": 712782
                    }
                }
            }
        }
    }
}


