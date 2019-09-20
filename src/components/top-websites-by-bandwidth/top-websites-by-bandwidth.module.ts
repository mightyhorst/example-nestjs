import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { TopWebsitesByBandwidthController } from './ctrl/top-websites-by-bandwidth.ctrl';

/**
* Services
**/
import { TopWebsitesByBandwidthService } from './service/top-websites-by-bandwidth.service';


@Module({
	imports: [ServicesModule],
	controllers: [TopWebsitesByBandwidthController],
	providers: [TopWebsitesByBandwidthService],
	exports: [TopWebsitesByBandwidthService],
})
export class TopWebsitesByBandwidthModule {}
