import { ApiModelProperty } from '@nestjs/swagger';

export class OpenshiftResponseDto {

	@ApiModelProperty({description: 'The name of the build'})
	buildName: string;

	@ApiModelProperty({description: 'The namespace of the build'})
	buildNamespace: string;

	@ApiModelProperty({description: 'The source URL of the build'})
	buildSource: string;

	@ApiModelProperty({description: 'The Git reference used in the build'})
	buildReference: string;

	@ApiModelProperty({description: 'The source commit used in the build'})
	buildCommit: string;

	@ApiModelProperty({description: 'The major version of the application'})
	versionMajor: string;

	@ApiModelProperty({description: 'The minor version of the application'})
	versionMinor: string;

	@ApiModelProperty({description: 'The build version of the application'})
	versionBuild: string;

	@ApiModelProperty({description: 'The build date of the currently running application, formatted as ISO8601 YYYY-mm-DD without time'})
	buildDate: string;

	constructor(data?: any){
		this.buildName = data.OPENSHIFT_BUILD_NAME;
		this.buildNamespace = data.OPENSHIFT_BUILD_NAMESPACE;
		this.buildSource = data.OPENSHIFT_BUILD_SOURCE;
		this.buildReference = data.OPENSHIFT_BUILD_REFERENCE;
		this.buildCommit = data.OPENSHIFT_BUILD_COMMIT;
		this.versionMajor = data.VERSION_MAJOR;
		this.versionMinor = data.VERSION_MINOR;
		this.versionBuild = data.VERSION_BUILD;
		this.buildDate = "";
	}
}
