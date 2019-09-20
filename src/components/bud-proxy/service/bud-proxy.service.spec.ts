import {Test, TestingModule} from '@nestjs/testing';
import {BudProxyService} from './bud-proxy.service';
import {ConfigService} from "nestjs-config";
import {BUDMetricType, BUDNetworkType} from "@components/bud-proxy/service/bud";

class MockConfigService {
    public get(v) {
        return { token: 'Bearer r32NugWxhwob4niMr9IvGb2IYf1JtJjl', api: 'https://bud.apps.det.nsw.edu.au/api/v1' };
    }
}
const sampleData = {
    data: {
        message: ''
    }
};
class MockHttpService{
    get<T>(url, config){
        return {
            toPromise:function(){
                return Promise.resolve(sampleData);
            }
        }
    }
}

describe('BUDProxyService', () => {
    let service: BudProxyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: 'ConfigService', useClass: MockConfigService },
                { provide: 'HttpService', useClass: MockHttpService },
                BudProxyService,
            ],
        }).compile();

        service = module.get<BudProxyService>(BudProxyService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should fetch inbound wan metrics for site 8171', async () => {
        const metrics = await service.getMetrics(BUDMetricType.Inbound, BUDNetworkType.WAN, '8171');
        expect(metrics).not.toBeNull();
    });

    it('should return an error for invalid link (site 8171 does not have a separate internet link)', async () => {
        const metrics = await service.getMetrics(BUDMetricType.Inbound, BUDNetworkType.Internet, '8171');
        expect(metrics).not.toBeNull();
        expect(metrics).toHaveProperty('message');
    });
});
