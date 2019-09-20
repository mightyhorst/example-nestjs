import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { UtilisationController } from './ctrl/utilisation.ctrl';

/**
* Services
**/
import { UtilisationService } from './service/utilisation.service';


@Module({
	imports: [ServicesModule],
	controllers: [UtilisationController],
	providers: [UtilisationService],
	exports: [UtilisationService],
})
export class UtilisationModule {}
