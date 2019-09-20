import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { AgeController } from './ctrl/age.ctrl';

/**
* Services
**/
import { AgeService } from './service/age.service';


@Module({
	imports: [ServicesModule],
	controllers: [AgeController],
	providers: [AgeService],
	exports: [AgeService],
})
export class AgeModule {}
