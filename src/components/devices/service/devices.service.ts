import {Injectable, Logger} from '@nestjs/common';
const bodybuilder = require('bodybuilder');
import * as moment from 'moment';

/**
 * ElasticSearch Provider
 **/
import {
    ElasticSearchService,
    ElasticSearchRequest, /*@todo - not used*/
    ElasticSearchResponse, buildQuery, IAggregation, IRange, ISortRules,
} from '@services/services.module';

/**
 * Highcharts Bar Chart
 **/
import {DevicesTableDto} from '../dto/index';

/**
 * Error handling
 **/
import {ElasticSearchError} from '@errors/index';

/**
 * @enum Enums
 **/
import {
    FormFactorEnum,
    WarrantyEnum,
    AgeEnum,
} from '@models/index';

/**
 * @requires Errors
 **/
import {ValidationError} from '@errors/index';
import {PieChartDto} from '@models/responses';
import {WarrantyTypes} from '@components/warranty/types';
import {UtilisationTypes} from '@components/utilisation/types';
import {AgeRanges} from '@components/age/types';
import { FormFactorTypes } from '@components/form-factor/index';

/**
 *
 * @class DevicesService
 *
 **/
@Injectable()
export class DevicesService {

    private esIndex: string;
    private readonly durationFields: string[] = ['age'];

    constructor(private readonly elasticSearchService: ElasticSearchService) {
        this.esIndex = 'ict_plus_device_data';
    }

    /**
     * Get the number of devices at a particular site code.
     *
     * @param siteCode
     */
    async count(siteCode: number): Promise<ElasticSearchResponse> {
        const bb = bodybuilder()
            .query('match', 'sitecode', siteCode)
            .size(0);

        const request = bb.build();
        Logger.debug(request);

        const response = await this.elasticSearchService.query(this.esIndex, request);
        Logger.debug(response);

        return response;
    }

    /**
     *
     * @method search - elastic search for devices
     * @todo error handling
     * @param  {number} siteCode - school ID
     * @param  {FormFactorTypes} formFactor - formFactor filter
     * @param  {string} warranty - warranty filter
     * @param  {string} ageOfDevice - ageOfDevice filter
     * @param  {string} utilisation - utilisation filter
     * @param  {number} size - limit the results returned.
     * @returns {Promise<ElasticSearchResponse>} es response
     * @throws {ElasticSearchError} error - elastic search error
     */
    async search(
        siteCode: number,
        formFactor?: FormFactorTypes,
        warranty?: WarrantyTypes,
        ageOfDevice?: AgeRanges,
        utilisation?: UtilisationTypes,
        model?: string,
        size?: number,
        fromIndex?: number,
        toIndex?: number,
        sort?: ISortRules[],
    ): Promise<ElasticSearchResponse> {

        /**
         * @todo - add size to query
         **/
        try {

            const esQuery = buildQuery(
                /** @param {number} siteCode **/     siteCode,
                /** @param {IAggregation} agg **/    {name: 'models', field: 'model'} as IAggregation,
                /** @param {string} formFactor **/   formFactor,
                /** @param {IRange} warranty **/     warranty,
                /** @param {IRange} ageOfDevice **/  ageOfDevice,
                /** @param {IRange} utilisation **/  utilisation,
                /** @param {string} model **/ 		model,
                /** @param {number} size **/ 		size,
                fromIndex,
                toIndex, 
                sort,
            );

            var results = await this.elasticSearchService.query(this.esIndex, esQuery);
                results.hits.hits = results.hits.hits.map(item => {
                    if(item._source.last_logon_user)
                        item._source.last_logon_user = '[protected]';
                    else
                        item._source.last_logon_user = '';
                    return item;
                })
            return results;

        } catch (err) {
            if (err instanceof ElasticSearchError) {
                /**@todo extra processing **/
            }
            throw err;
        }
    }

    validDate(dateStr){
        return moment(new Date(dateStr)).isValid();
    }
}
