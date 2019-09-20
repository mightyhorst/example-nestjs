/**
* @import Swagger  
**/
import { 
	ApiUseTags, 
	ApiBearerAuth, 
	ApiImplicitParam, 
	ApiImplicitQuery, 
	ApiOperation, 
	ApiResponse, 
	ApiOkResponse, 
	/** ApiUnauthorizedResponse, ** not released yet **/
	ApiForbiddenResponse,
	ApiUnprocessableEntityResponse,
	ApiInternalServerErrorResponse,
	ApiServiceUnavailableResponse,
	ApiRequestTimeoutResponse
} from '@nestjs/swagger';

/**
* @import Endpoint 
**/
import { 
	Controller, 
	Get, 
	Query, 
	Param 
} from '@nestjs/common';


/**
* @import Services 
**/
import { OpenshiftService } from '../service/openshift.service';

/**
* @import Responses 
**/
import { 
	OpenshiftResponseDto, 
	OpenshiftErrorResponseDto
} from '../dto/index';

/**
* @import Errors 
**/
import { 
	HttpError, 
	ErrorType, 
	ServerError, 
	ValidationError, 
	IntegrationError, 
	AuthError 
} from '@errors/index';

/**
*
* @class OpenshiftController  
*
**/
@ApiUseTags('openshift')
@ApiBearerAuth()
@Controller('api/v2/openshift')
export class OpenshiftController {

	constructor(private readonly openshiftService: OpenshiftService){}

	/**
	*
	* GET /api/v2/openshift/info
	*
	**/ 
	@Get('info')
	@ApiOperation({ title: 'Get OpenShift Build Information' })
	@ApiOkResponse({
		description: 'The current openshift build information response',
		type: OpenshiftResponseDto
	})
	@ApiResponse({ 
		/* @ApiUnauthorizedResponse ** not released yet **/
		status: 401, 
		description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
		type: AuthError
	})
	@ApiForbiddenResponse({ 
		description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
		type: AuthError
	})
	@ApiInternalServerErrorResponse({ 
		description: 'Server Error - A runtime error to be fixed by developer',
		type: ServerError
	})
	async info(): Promise<OpenshiftResponseDto|OpenshiftErrorResponseDto> {
		const response: OpenshiftResponseDto = await this.openshiftService.info();
		return response;
	}

}