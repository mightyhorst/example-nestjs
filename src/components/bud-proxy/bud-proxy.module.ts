import {Module, HttpModule} from '@nestjs/common';
import {BudProxyService} from './service/index';
import {BudProxyController} from './ctrl/index';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [BudProxyController],
    providers: [BudProxyService],
})
export class BudProxyModule {}
