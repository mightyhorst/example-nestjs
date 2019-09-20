import { Module } from '@nestjs/common';


/**
* Controller
**/
import { OpenshiftController } from './ctrl/openshift.ctrl';

/**
* Services
**/
import { OpenshiftService } from './service/openshift.service';


@Module({
	controllers: [OpenshiftController],
	providers: [OpenshiftService],
	exports: [OpenshiftService],
})
export class OpenshiftModule {}
