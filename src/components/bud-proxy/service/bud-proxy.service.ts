/**
 * Framework
 **/
import {Injectable, HttpService, Logger, BadGatewayException} from '@nestjs/common';
import {InjectConfig, ConfigService} from 'nestjs-config';
import {AxiosResponse, AxiosError} from 'axios';
import axios from 'axios';
import {BUDMetricType, BUDNetworkType, BUDResponse, IMetric} from '@components/bud-proxy/service/bud';

@Injectable()
export class BudProxyService {

    /**
     * The URI to the BUD API (The API root, not application root)
     */
    private baseUrl: string;

    /**
     * The BUD bearer token (Including the word `Bearer`)
     */
    private token: string;

    /**
     * HTTP Request Service (which wraps AxiosInstance)
     */
    private http: HttpService;

    /**
     * @constructor
     * @param {ConfigService} config - config
     * @param {HttpService} http HTTP Request Service
     */
    constructor(@InjectConfig() private readonly config: ConfigService, http: HttpService) {
        this.baseUrl = config.get('bud').api;
        this.token = config.get('bud').token;
        this.http = http;
    }

    /**
     * @method getMetrics
     * @description Get bandwidth traffic metrics for a given interface at a given site.
     *
     * @param {BUDMetricType}  metric Type of metric required for this site, usually one of BUDMetricType.Inbound or
     *                         BUDMetrictype.Outbound
     * @param {BUDNetworkType} link The network connection to retrieve metrics for.
     * @param {string}         siteCode School code
     * @throws {BadGatewayException}  When BUD connection fails
     * @returns {Promise<BUDResponse<IMetric>>} Resolved BUD response as result.
     */
    async getMetrics(metric: BUDMetricType, link: BUDNetworkType, siteCode: string): Promise<BUDResponse<IMetric>> {

        const url = `${this.baseUrl}/metrics/${metric}/${link}/${siteCode}`;
        Logger.log(`Retrieving BUD Metrics from ${url}`, 'BudProxyService');

        const res = await this.http.get<BUDResponse<IMetric>>(url, {
            headers: {
                'Authorization': this.token,
            }
        }).toPromise().catch(e => {
            Logger.error(`Error fetching BUD Metrics: ${e.message}`, e.toString(), 'BudProxyService');
            throw new BadGatewayException(e, 'Error fetching BUD Data');
        });

        return res.data;
    }
}
