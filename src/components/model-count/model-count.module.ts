import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { ModelCountController } from './ctrl/model-count.ctrl';

/**
* Services
**/
import { ModelCountService } from './service/model-count.service';


@Module({
	imports: [ServicesModule],
	controllers: [ModelCountController],
	providers: [ModelCountService],
	exports: [ModelCountService],
})
export class ModelCountModule {}
