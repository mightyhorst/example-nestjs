import { AgeRanges } from '@components/age/types';
import { UtilisationTypes} from '@components/utilisation/types';
import { WarrantyTypes } from '@components/warranty/types';
import {ElasticSearchResponse} from '@services/services.module';

export var mockEsResponse:ElasticSearchResponse = {
	took: 0,
	timed_out: false,
	_shards: {
	    total: 100,
	    successful: 100,
	    skipped: 0,
	    failed: 0
	},
	hits: {
	    total: 100,
	    max_score: 100,
	    hits: {
	        _index: 'ictplus',
	        _type: 'type',
	        _id: 'id',
	        _score: 100,
	        _source: {}
	    }
	},
	aggregations: {}
}


export class MockService{
    async search(
    	siteCode:number, 
    	formFactor?:string, 
    	warranty?:WarrantyTypes,
        ageOfDevice?:AgeRanges,
    	utilisation?:UtilisationTypes,
    	model?:string,
    	size?:number
    ):Promise<ElasticSearchResponse>{
    	var _source = {};
    	if(formFactor){
    		_source['isFormfactor'] = true;
    	}
    	if(warranty){
            _source['isWarranty'] = true;
    	}
        if(ageOfDevice){
            _source['isAgeOfDevice'] = true;
        }
    	if(utilisation){
            _source['isUtilisation'] = true;
    	}
    	if(model){
            _source['isModel'] = true;
    	}
    	if(size){
            _source['isSize'] = true;
            mockEsResponse.hits.total = size;
    	}
    	mockEsResponse.hits.hits._source = _source;
        return Promise.resolve(mockEsResponse);
    }
}