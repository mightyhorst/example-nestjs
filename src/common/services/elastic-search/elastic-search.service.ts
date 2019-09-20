/* @todo - env file  
process.env.ELASTICSEARCH_HOST = 'http://vpc-ictplustest-ci4hdrpuv4gyepev3khzfo7eoa.ap-southeast-2.es.amazonaws.com';
const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST || 'localhost:9200';
*/

/**
 * Framework
 **/
import {Injectable} from '@nestjs/common';
import {InjectConfig} from 'nestjs-config';


/**
 * Elastic Search Library
 **/
const elasticSearch = require('elasticsearch');


/**
 * Elastic Search Req + Res
 **/
import {ElasticSearchRequest} from './dto/es-request';
import {ElasticSearchResponse} from './dto/es-response';

/**
 * Error handling
 */
import {ElasticSearchError} from '@errors/index';

/**
 *
 * @class ElasticSearchService - service to query ElasticSearch
 *
 */
@Injectable()
export class ElasticSearchService {

    private client;

    constructor(@InjectConfig() private readonly config) {

        this.client = new elasticSearch.Client({
            host: config.get('elasticsearch').host,
            log: config.get('elasticsearch').log,
        });
    }

    /**
     *
     * @method search - query to send to Elastic search
     * @todo - type with Interface
     *
     */
    async query(esIndex: string, query): Promise<ElasticSearchResponse> | never {
        
        try {
            return await this.client.search({
                index: esIndex,
                body: query,
            });
        } catch (err) {
            throw new ElasticSearchError(err.message);
        }
    }

    /**
     *
     * @method ping - test online
     * @todo - type with Interface
     * @todo - type with Error
     *
     */
    ping(): Promise<boolean> {
        return new Promise((done, fail) => {
            this.client.ping({
                requestTimeout: 30000,
            }, (error) => {
                if (error) {
                    console.error('elasticsearch cluster is down!', {err: error});
                    fail(false);
                } else {
                    console.log('All is well');
                    done(true);
                }
            });
        });
    }
}
