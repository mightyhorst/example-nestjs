import {Injectable} from '@nestjs/common';

/**
 * @requires ElasticSearch Provider
 **/
import {
    ElasticSearchService,
    ElasticSearchRequest, /*@todo - not used*/
    ElasticSearchResponse,
    buildQuery, IAggregation, IRange,
} from '@services/services.module';

/**
 * @requires Highcharts Pie Chart
 **/
import {PieChartDto} from '@responses/index';

/**
 * @requires Error handling
 **/
import {ElasticSearchError} from '@errors/index';

/**
* @requires Types
**/
import { WarrantyTypes } from '@components/warranty/types';
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { FormFactorTypes } from '@components/form-factor/index';

/**
 *
 * @class WarrantyService
 *
 **/
@Injectable()
export class WarrantyService {

    private esIndex: string;

    constructor(private readonly elasticSearchService: ElasticSearchService) {
        this.esIndex = 'ict_plus_device_data';
    }

    /**
     * @method search - elastic search for warranty
     * @todo error handling
     * @param  {number} siteCode - school ID
     * @param {number} siteCode - school ID
     * @param {FormFactorTypes} formFactor - formFactor filter
     * @param {WarrantyTypes} warranty - warranty filter
     * @param {AgeRanges} ageOfDevice - ageOfDevice filter 
     * @param {UtilisationTypes} utilisation - utilisation filter
     * @param {string} model - model filter
     * @param {number} size - limit the results returned. 
     * @returns {Promise<ElasticSearchResponse>} es response
     * @throws {ElasticSearchError} error - elastic search error
     */
    async search(
        siteCode: number,
        formFactor?: FormFactorTypes,
        warranty?:WarrantyTypes,
        ageOfDevice?: AgeRanges,
        utilisation?: UtilisationTypes,
        model?: string,
        size?: number,
    ): Promise<ElasticSearchResponse> {

        /**
         * @todo - add size to query
         **/
        try {
            const ranges = [
                /**
                 * Expired
                 **/
                {to: 'now-1d'},

                /**
                 * Expiring in next 6 months
                 **/
                {from: 'now', to: 'now+6M'},

                /**
                 * Expiring after 6 months
                 **/
                {from: 'now+6M'},
            ];
            const esQuery = buildQuery(
                /**@param {number} siteCode **/     siteCode,
                /**@param {IAggregation} agg **/    {
                    name: 'warranty_ranges',
                    field: 'warranty',
                    range: ranges,
                } as IAggregation,
                /**@param {string} formFactor **/   formFactor,
                /**@param {IRange} warranty **/     warranty,
                /**@param {IRange} ageOfDevice **/  ageOfDevice,
                /**@param {IRange} utilisation **/  utilisation,
                /**@param {string} model **/        model,
                /**@param {number} size **/        size,
            );

            console.log('warranty.service.esQuery', {
                'esQuery': esQuery,
                'esQuery.aggs.warranty_ranges': esQuery.aggs.warranty_ranges,
                'esQuery.aggs.warranty_ranges.range.ranges': esQuery.aggs.warranty_ranges.range.ranges,
            });
            
            return await this.elasticSearchService.query(this.esIndex, esQuery);

        } catch (err) {
            if (err instanceof ElasticSearchError) {
                /**@todo extra processing **/
            }
            throw err;
        }

    }

    /**
     * @method searchToChart - chart data from elastic search for warranty
     * @todo error handling
     * @param {number} siteCode - school ID
     * @param {FormFactorTypes} formFactor - formFactor filter
     * @param {WarrantyTypes} warranty - warranty filter
     * @param {AgeRanges} ageOfDevice - ageOfDevice filter 
     * @param {UtilisationTypes} utilisation - utilisation filter
     * @param {string} model - model filter
     * @param {number} size - limit the results returned. 
     * @return {Promise<BarChartDto>} barChart - bar chart data
     * @throws {ElasticSearchError} error - elastic search error
     */
    async searchToChart(
        siteCode: number,
        formFactor?: FormFactorTypes,
        warranty?: WarrantyTypes,
        ageOfDevice?: AgeRanges,
        utilisation?: UtilisationTypes,
        model?: string,
        size?: number,
    ): Promise<PieChartDto[]> {

        try {

            const elasticSearchResponse = await this.search(
                siteCode,
                formFactor,
                warranty,
                ageOfDevice,
                utilisation,
                model,
                size,
            );

            const buckets = elasticSearchResponse.aggregations.warranty_ranges.buckets;

            /**@todo @bug - item.doc_count is always 0
             **/
            const pieChart = buckets
                .map((item, index) => {
                    
                    switch (index) {
                        case 0:
                            return new PieChartDto('Expired Warranty', item.doc_count);

                        case 1:
                            return new PieChartDto('Approaching Warranty', item.doc_count);

                        case 2:
                            return new PieChartDto('Under Warranty', item.doc_count);

                        default:
                            console.log('There was an error ', {item, index});
                            break;
                    }
                });

            return pieChart;
        } catch (err) {
            if (err instanceof ElasticSearchError) {
                /**@todo extra processing **/
            }
            throw err;
        }

    }
}
