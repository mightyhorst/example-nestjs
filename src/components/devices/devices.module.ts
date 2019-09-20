import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { DevicesController } from './ctrl/devices.ctrl';

/**
* Services
**/
import { DevicesService } from './service/devices.service';


@Module({
	imports: [ServicesModule],
	controllers: [DevicesController],
	providers: [DevicesService],
	exports: [DevicesService],
})
export class DevicesModule {}
