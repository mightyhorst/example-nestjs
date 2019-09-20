/**
* @todo - not used 
* @todo - strongly type bodybuilder 
**/
export interface ElasticSearchRequest{
	query: IQuery;
	aggs: IAggs;
}

export interface IQuery{
	match?: IMatch;
	bool?: IBoolMatch;
}

	export interface IMatch{
		sitecode?: number;
		form_factor?: string;
		warranty?: string;
	}

	export interface IBoolMatch{
		must?: IMatch[]|IRange[];
	}

		export interface IRange{
			sitecode?: number;
			form_factor?: string;
		}

export interface IAggs{
	warranty_ranges?:any;
	form_factor_?:any;
	age_ranges?:any;
}