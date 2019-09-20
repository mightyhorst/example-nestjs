export const exampleEsResponse = { 
	"took":162, 
	"timed_out":false, 
	"_shards":{ 
		"total":5, 
		"successful":5, 
		"skipped":0, 
		"failed":0 
	}, 
	"hits":{ 
		"total":53903, 
		"max_score":0, 
		"hits":[ ] 
	}, 
	"aggregations":{ 
		"Websites":{ 
			"buckets":{ 
				"department":{ 
					"doc_count":6916, 
					"total_hit_counts":{ 
						"value":16309155523 
					} 
				}, 
				"non-department":{ 
					"doc_count":46987, 
					"total_hit_counts":{ 
						"value":47708860822 
					} 
				} 
			} 
		} 
	} 
}


