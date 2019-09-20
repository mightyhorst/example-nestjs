import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
* Config
**/
import { ConfigService} from 'nestjs-config';
import * as path from 'path';
import { zipkinMiddleware } from './common/zipkin/zipkin.middleware';

/**
* Errors
**/
import { ErrorFilter } from './common/filters/errors.filter';


/**
* Views 
**/
import { join } from 'path';

/**
* Swagger Builder Util Service
**/
import { SwaggerUtil } from './common/swagger/swagger.util';


/**
* HTTPS + Multiple servers 
**/
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');



async function bootstrap() {

	let app;
	if (config().ssl.https && config().ssl.key && config().ssl.cert) {
		const keyFile = fs.readFileSync(join(__dirname, config().ssl.key));
		const certFile = fs.readFileSync(join(__dirname, config().ssl.cert));

		app = await NestFactory.create(AppModule, {
			httpsOptions: { key: keyFile, cert: certFile },
		});
	} else {
		app = await NestFactory.create(AppModule);
	}

	/**
	* Global Middleware
	**/
	console.log('🦄 NODE_ENV ', process.env.NODE_ENV);
	// app.setGlobalPrefix('api/v2');
	app.enableCors();
	
	/**
	* Swagger Docs
	**/
	SwaggerUtil.buildSwagger(app);

	/**
	* Views
	**/
	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('hbs');
	
	/**
	* Error handler
	**/
	app.useGlobalFilters(new ErrorFilter());

	/**
	* OpenZipkin 
	**/
	// zipkinMiddleware(app);
	
	/**
	* Single server
	**/
	if (process.env.NODE_ENV !== 'integration' && config().ssl.httpsEnabled === true) {
		if(config().ssl.key && config().ssl.cert) {
			console.log(`🦄 Https enabled: ${config().ssl.httpsEnabled}`);
			console.log(`🦄 Using SSL private key from ${config().ssl.key}`);
			console.log(`🦄 Using SSL certificate from ${config().ssl.cert}`);

			console.log("🦄 Listening on port " + config().ports.https);
			await app.listen(config().ports.https);
		}
	} else {
		console.log(`🐨 Https enabled: ${config().ssl.httpsEnabled}`);
		console.log("🐨 Listening on port " + config().ports.http);
		await app.listen(config().ports.http);
	}
}
bootstrap();




function config() {

	return (ConfigService as any).loadConfigSync(
		path.join(__dirname, './config/*.config.{ts,js}'),
		{
            modifyConfigName: name => name.replace('.config', ''),
        }
	);
}