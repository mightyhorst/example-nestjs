import {Logger} from '@nestjs/common';
import {WarrantyTypes} from '@components/warranty/types';
import {UtilisationTypes} from '@components/utilisation/types';
import {AgeRanges} from '@components/age/types';
import { FormFactorTypes } from '@components/form-factor/index';

const bodybuilder = require('bodybuilder');

/**
* @const defaults to 10,000
* @external https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
**/
const MAX_SIZE = 10000;

export interface IAggregation {
    name: string;
    field: string;
    /*range?: {
        format?: string,
        ranges: IFromTo[]
    },*/
    range?: IFromTo[];
}

export interface IRange {
    gt?: string;
    gte?: string;
    lt?: string;
    lte?: string;
}

export interface IFromTo {
    to?: string;
    from?: string;
}

export interface ISortRules {
    [fieldName: string]: 'asc' | 'desc';
}

/**
 * @param {number} siteCode - (required) school ID
 * @param {IAggregation} agg - (optional) aggreation
 * @param {FormFactorTypes} formFactor - (optional) filter by form factor
 * @param {WarrantyTypes} warranty  - (optional) filter by warranty range
 * @param {AgeRanges} age  - (optional) filter by age of device range
 * @param {UtilisationTypes} utilisation - (optional) filter by utilisation range
 * @param {string} model - (optional) filter by model
 * @param {number} size - (optional) limit size of the response
 * @todo EsQuery interface - strongly type return ... but whatever
 **/
export function buildQuery(
    siteCode: number,
    agg?: IAggregation,
    formFactor?: FormFactorTypes,
    warranty?: WarrantyTypes,
    age?: AgeRanges,
    utilisation?: UtilisationTypes,
    model?: string,
    size?: number,
    fromIndex?: number,
    toIndex?: number,
    sort?: ISortRules[],
) {

    /**
     * @param  {number} siteCode - school ID
     **/
    let esReq = bodybuilder()
        .query('match', 'sitecode', siteCode);

    if (size) {
        esReq = esReq.size(size);

        /**@todo @bug this is breaking **/
        if (fromIndex) {
            // esReq = esReq.from(fromIndex);
        }
        /**@todo @this is not used **/
        if (toIndex) {
            
        }
    }

    if (sort && sort.length > 0) {
        for (let i = 0; i < sort.length; i++) {
            const rule = sort[i];

            for (let propName in rule) {
                if (!rule.hasOwnProperty(propName)) continue;
                esReq = esReq.sort(propName, rule[propName]);
            }
        }
    }

    /**
     * @param  {string} formFactor - formFactor filter
     **/
    if (formFactor) {
        let qFormFactor;
        switch(formFactor.toLowerCase()){
            case FormFactorTypes.macos_laptop.toLowerCase():
                 qFormFactor = 'macOS Laptop';
                 break;
            case FormFactorTypes.macos_desktop.toLowerCase():
                qFormFactor = 'macOS Desktop';
                break;
            case FormFactorTypes.chromedevice.toLowerCase():
                qFormFactor = 'ChromeDevice';
                break;
            case FormFactorTypes.servers.toLowerCase():
                qFormFactor = 'Servers';
                break;
            case FormFactorTypes.desktop.toLowerCase():
                qFormFactor = 'Desktop';
                break;
            case FormFactorTypes.laptop.toLowerCase():
                qFormFactor = 'Laptop';
                break;
            case FormFactorTypes.unknown.toLowerCase():
                qFormFactor = 'Unknown';
                break;
        }
        console.log('formFactor.toLowerCase ', formFactor);
        console.log('qFormFactor ', qFormFactor);
        esReq = esReq.query('match', 'form_factor', qFormFactor);
    }

    /**
     * @param  {string} warranty - warranty filter
     **/
    if (warranty) {
        switch (warranty) {
            case WarrantyTypes.covered:
                esReq = esReq.query('range', 'warranty', {from: 'now+6M'});
                break;
            case WarrantyTypes.expired:
                esReq = esReq.query('range', 'warranty', {to: 'now'});
                break;
            case WarrantyTypes.expiring_soon:
                esReq = esReq.query('range', 'warranty', {from: 'now', to: 'now+6M'});
                break;
        }
    }

    /**
     * @param  {string} age - age of device filter
     **/
    if (age) {
        switch (age) {
            case '1_year_old':
                esReq = esReq.query('range', 'release_year', {from: 'now-1y'});
                break;
            case '2_years_old':
                esReq = esReq.query('range', 'release_year', {from: 'now-2y', to: 'now-1y'});
                break;
            case '3_years_old':
                esReq = esReq.query('range', 'release_year', {from: 'now-3y', to: 'now-2y'});
                break;
            case '4_years_old':
                esReq = esReq.query('range', 'release_year', {from: 'now-4y', to: 'now-3y'});
                break;
            case '5_plus_years_old':
                esReq = esReq.query('range', 'release_year', {to: 'now-4y'});
                break;
        }
    }

    /**
     * @param  {string} utilisation - utilisation filter
     **/
    if (utilisation) {
        switch (utilisation) {
            case UtilisationTypes.this_week:
                esReq = esReq.query('range', 'last_logon_timestamp0', {from: 'now-7d', to: 'now'});
                break;
            case UtilisationTypes.last_week:
                esReq = esReq.query('range', 'last_logon_timestamp0', {from : "now-15d", to : "now-7d-1m" });
                break;
            case UtilisationTypes.several_weeks_ago:
                esReq = esReq.query('range', 'last_logon_timestamp0', {from : "now-30d", to : "now-15d-1m"});
                break;
            case UtilisationTypes.over_30_days_old:
                esReq = esReq.query('range', 'last_logon_timestamp0', {to: "now-30d-1m"});
                break;
        }
    }

    /**
     * @param  {string} model - modelcount filter
     **/
    if (model) {

        esReq = esReq.query('match', 'model', model);

    }

    /**
    * Size
    **/
    if(size){
        esReq.size(size);
    }
    else{
        esReq.size(MAX_SIZE);
    }

    /**
     * Aggregation
     **/
    if (agg) {

        if (agg.range) {

            /** @todo
             esReq = esReq.aggregation(agg.field, agg.name, {
				format: 'MM-yyy',
				ranges: agg.range
			});
             **/

            /**@todo
             * @hack - manully add the aggregation json NOT using bodybuilder
             **/
            let esQuery = esReq.build();
            esQuery.aggs = { 
                //size: (size  ? size : MAX_SIZE) 
            }

            esQuery.aggs[agg.name] = {
                'range': {
                    'field': agg.field,
                    'ranges': agg.range,

                    /** @todo - this breaks everything **/
                    /* 'size': (size  ? size : MAX_SIZE)  */

                }
            }

            return esQuery;

        } else {
            /** @todo
            esReq = esReq.aggregation('terms', agg.field, agg.name);
            **/

            /**@todo
            * @hack - manully add the aggregation json NOT using bodybuilder
            **/
            let esQuery = esReq.build();
            esQuery.aggs = {}

            esQuery.aggs[agg.name] = {
                'terms': {
                    'field': agg.field,
                    'size': (size ? size : MAX_SIZE)
                }
            }

            return esQuery;
        }
    }

    const body = esReq.build();
    Logger.debug(body, 'bodybuilder.service');

    return body;
}
