import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { WarrantyController } from './ctrl/warranty.ctrl';

/**
* Services
**/
import { WarrantyService } from './service/warranty.service';


@Module({
	imports: [ServicesModule],
	controllers: [WarrantyController],
	providers: [WarrantyService],
	exports: [WarrantyService],
})
export class WarrantyModule {}
