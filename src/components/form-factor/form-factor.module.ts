import { Module } from '@nestjs/common';

/**
* Modules
**/
import { ServicesModule } from '@services/services.module';

/**
* Controller
**/
import { FormFactorController } from './ctrl/form-factor.ctrl';

/**
* Services
**/
import { FormFactorService } from './service/form-factor.service';


@Module({
	imports: [ServicesModule],
	controllers: [FormFactorController],
	providers: [FormFactorService],
	exports: [FormFactorService],
})
export class FormFactorModule {}
