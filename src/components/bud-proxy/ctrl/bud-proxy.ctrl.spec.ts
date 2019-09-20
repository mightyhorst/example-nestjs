import {Test, TestingModule} from '@nestjs/testing';
import {BudProxyController} from './bud-proxy.ctrl';
import {BudProxyService} from '../service/bud-proxy.service';

class MockConfigService {
    public get(v) {
        return {token: 'Bearer r32NugWxhwob4niMr9IvGb2IYf1JtJjl', api: 'https://bud.apps.det.nsw.edu.au/api/v1'};
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

describe('BUD Proxy Controller', () => {
    let controller: BudProxyController;
    let service: BudProxyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BudProxyController],
            providers: [
                {provide: 'ConfigService', useClass: MockConfigService},
                { provide: 'HttpService', useClass: MockHttpService },
                BudProxyService,
            ],
        }).compile();

        controller = module.get<BudProxyController>(BudProxyController);
        service = module.get<BudProxyService>(BudProxyService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    // it('should be able to fetch metrics from BUD', async () => {
    //     const result = await controller.getMetrics();
    // });

});