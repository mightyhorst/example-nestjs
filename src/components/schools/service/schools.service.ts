import {Injectable, Logger} from '@nestjs/common';

/**
 * ElasticSearch Provider
 **/
import {
    ElasticSearchService,
    ElasticSearchRequest, /*@todo - not used*/
    ElasticSearchResponse,
} from '@services/services.module';
import * as bodybuilder from 'bodybuilder';

/**
 *
 * @class SchoolsService
 *
 **/
@Injectable()
export class SchoolsService {

    private esIndex: string;
    private readonly durationFields: string[] = ['age'];

    constructor(private readonly elasticSearchService: ElasticSearchService) {
        this.esIndex = 'ict_plus_school_data';
    }

    /**
     * Find all records matching the given criteria.
     *
     * @param {number} limit The limit of records returned. Default is 20.
     * @param {number} offset The record offset to start at. Default is 0 (zero).
     * @param {array} sort A list of strings containing field names to sort by. If the string is prefixed with a minus
     *                '-' then the field is sorted in ascending order.
     * @param {Object} filter An object literal of key: value pairs in which the values must match exactly.
     * @param {String} query A free text query to search for matching items.
     */
    async findAll(
        limit: number = 20,
        offset: number = 0,
        sort: string[] = [],
        filter?: any,
        query?: string,
    ) {
        let bb = bodybuilder().size(limit); // .from(offset)

        if (filter) {
            const filterKeys = Object.keys(filter);
            for (let i = 0; i < filterKeys.length; i++) {
                let key = filterKeys[i];

                bb = bb.query('match', key, filter[key]);
            }
        } else if (query) {
            bb = bb.query('query_string', { query: `${query}*`, fields: ['site_name'], });
        } else {
            bb = bb.query('match_all');
        }

        /*
        if (sort.length > 0) {
            const sorting = sort.map((field) => {
                const rule = {};
                if (field[0] === '-') {
                    rule[field.substr(1)] = 'desc';
                    return rule;
                } else {
                    return field;
                }
            });
        
            request["sort"] = sorting;
        }
        */

        try {
            const request = bb.build();
            Logger.debug(request, 'schools.service');

            const response = await this.elasticSearchService.query(this.esIndex, request);
            Logger.debug(response, 'schools.service');

            return response;
        } catch (e) {
            return null;
        }
    }

    /**
     * Find a single school by its sitecode.
     *
     * @param siteCode
     */
    async findOne(siteCode: string): Promise<ElasticSearchResponse> {
        const request = {
            query: {
                match: {
                    site_code: parseInt(siteCode, 0),
                },

            },
            size: 1,
        };

        const res = await this.elasticSearchService.query(this.esIndex, request);
        return res;
    }
}
