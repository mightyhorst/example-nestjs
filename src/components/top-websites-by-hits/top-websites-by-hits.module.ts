import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { TopWebsitesByHitsController } from './ctrl/top-websites-by-hits.ctrl';

/**
* Services
**/
import { TopWebsitesByHitsService } from './service/top-websites-by-hits.service';


@Module({
	imports: [ServicesModule],
	controllers: [TopWebsitesByHitsController],
	providers: [TopWebsitesByHitsService],
	exports: [TopWebsitesByHitsService],
})
export class TopWebsitesByHitsModule {}
