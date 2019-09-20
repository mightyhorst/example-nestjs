const yarn = require('package.json');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
* @release v1.0
**/
import { FormFactorModule }  from '@components/form-factor/form-factor.module';
import { ModelCountModule }  from '@components/model-count/model-count.module';
import { WarrantyModule } 	 from '@components/warranty/warranty.module';
import { AgeModule } 		 from '@components/age/age.module';
import { UtilisationModule } from '@components/utilisation/utilisation.module';
import { DevicesModule }     from '@components/devices/devices.module';
import { SchoolsModule } from '@components/schools/schools.module';
import { OpenshiftModule } from '@components/openshift/openshift.module';
import { BudProxyModule } from '@components/bud-proxy/bud-proxy.module';

/**
* @release v2.0
**/
import { TopWebsitesByHitsModule } from '@components/top-websites-by-hits/top-websites-by-hits.module';
import { TopWebsitesByBandwidthModule } from '@components/top-websites-by-bandwidth/top-websites-by-bandwidth.module';


export class SwaggerUtil{

	static buildSwagger(app){

	  	const options = new DocumentBuilder()
			.setTitle('ICT Plus API v2')
			.setDescription('The ICT Plus API for querying. NB: go to /auth/saml/backdoor to retrieve a token and click "Authorize" button. Enter JWT {token}')
			// .setVersion('2.0')
			.setVersion(yarn.version)
			.setBasePath('/')
			.setSchemes('https', 'http')
			.addBearerAuth()
			.build();

	    const swaggerDoc = SwaggerModule.createDocument(
	    	app, 
	    	options, 
	    	SwaggerUtil.includeModules()
	    );
	    SwaggerModule.setup('/docs', app, swaggerDoc);

	}

	static includeModules(){
		return { 
	    	include: [
	    		TopWebsitesByHitsModule,
	    		TopWebsitesByBandwidthModule,
	    		FormFactorModule,
	    		WarrantyModule,
	    		AgeModule,
	    		UtilisationModule, 
	    		ModelCountModule,
				DevicesModule,
				SchoolsModule,
				OpenshiftModule,
				BudProxyModule,
	    	] 
	    }
	}

}