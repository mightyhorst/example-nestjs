import {Module} from '@nestjs/common';

/**
 * Modules
 **/
import { ServicesModule } from '@services/services.module';

/**
 * Controller
 **/
import {SchoolsController} from './ctrl/schools.ctrl';

/**
 * Services
 **/
import {SchoolsService} from './service/schools.service';

@Module({
    imports: [ServicesModule],
    controllers: [SchoolsController],
    providers: [SchoolsService],
    exports: [SchoolsService],
})
export class SchoolsModule {}
