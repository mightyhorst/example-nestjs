import * as path from 'path';

import {Module, NestModule, MiddlewareConsumer} from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {loggerMiddleware} from './common/middleware/logger.middleware';

/**
 * Component + Common Modules
 **/
import {AuthModule} from '@auth/auth.module';
import {ServicesModule} from '@services/services.module';
import {ElasticSearchService} from '@services/elastic-search/elastic-search.service';

import {FormFactorModule} from '@components/form-factor/form-factor.module';
import {ModelCountModule} from '@components/model-count/model-count.module';
import {WarrantyModule} from '@components/warranty/warranty.module';
import {AgeModule} from '@components/age/age.module';
import {UtilisationModule} from '@components/utilisation/utilisation.module';
import {DevicesModule} from '@components/devices/devices.module';
import {SchoolsModule} from '@components/schools/schools.module';
import {OpenshiftModule} from '@components/openshift/openshift.module';
import {BudProxyModule} from '@components/bud-proxy/bud-proxy.module';
import { TopWebsitesByHitsModule } from '@components/top-websites-by-hits/top-websites-by-hits.module';
import { TopWebsitesByBandwidthModule } from '@components//top-websites-by-bandwidth/top-websites-by-bandwidth.module';


@Module({
    imports: [
        ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
            modifyConfigName: name => name.replace('.config', ''),
        }),
        TopWebsitesByHitsModule,
        TopWebsitesByBandwidthModule,
        AuthModule,
        ServicesModule,
        FormFactorModule,
        ModelCountModule,
        WarrantyModule,
        AgeModule,
        UtilisationModule,
        DevicesModule,
        SchoolsModule,
        OpenshiftModule,
        BudProxyModule,
        
    ],
    controllers: [AppController],
    providers: [AppService, ElasticSearchService]
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(loggerMiddleware)
            .forRoutes('api/v2');
    }
}
