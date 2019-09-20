import { Injectable, Logger } from '@nestjs/common';
import {OpenshiftResponseDto} from "@components/openshift/dto";
import * as fs from 'fs';
import * as path from 'path';

/**
* 
* @class OpenshiftService 
*
**/
@Injectable()
export class OpenshiftService {

	constructor() {}

	async info(): Promise<OpenshiftResponseDto> {
		let data = {
			'OPENSHIFT_BUILD_NAME': process.env.OPENSHIFT_BUILD_NAME || 'None',
			'OPENSHIFT_BUILD_NAMESPACE': process.env.OPENSHIFT_BUILD_NAMESPACE || 'None',
			'OPENSHIFT_BUILD_SOURCE': process.env.OPENSHIFT_BUILD_SOURCE || 'None',
			'OPENSHIFT_BUILD_REFERENCE': process.env.OPENSHIFT_BUILD_REFERENCE || 'None',
			'OPENSHIFT_BUILD_COMMIT': process.env.OPENSHIFT_BUILD_COMMIT || 'None',
		};

		const packageJsonPath = path.resolve(__dirname, '..', '..', '..', '..', 'package.json');

		try {
			// Get version from package.json
			const packageJsonData = fs.readFileSync(packageJsonPath);
			const packageJson = JSON.parse(packageJsonData.toString());

			const version = packageJson.version;
			const versionParts = version.split('.');

			data['VERSION_MAJOR'] = versionParts[0];
			data['VERSION_MINOR'] = versionParts[1];
			data['VERSION_BUILD'] = versionParts[2];
		} catch (e) {
			Logger.error("Failed to read package.json from " + packageJsonPath);
			data['VERSION_MAJOR'] = '0';
			data['VERSION_MINOR'] = '0';
			data['VERSION_BUILD'] = '0';
		}

		const result = new OpenshiftResponseDto(data);
		return result;
	}
}
