/**
 * Swagger
 */
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
    ApiRequestTimeoutResponse,
} from '@nestjs/swagger';

/**
 * Endpoint
 */
import {
    Controller,
    Get,
    Query,
    Param,
    UseGuards,
    Res,
    Header,
    Logger,
} from '@nestjs/common';
import {Response} from 'express';

/**
 * Services
 */
import {BudProxyService} from '../service/index';

/**
 * Responses
 */
import {
    BudApiResponse as ResDto,
    BudErrorResponse as ErrDto,
} from '../dto/index';
import {
    AuthErrorResponseDto as AuthErrorRes,
    ValidationErrorResponseDto as ValidErrorRes,
    IntegrationErrorResponseDto as PlatErrorRes,
    ServerErrorResponseDto as ServerErrorRes,
    ErrorResponseDto as ErrRes,
} from '@responses/index';

/**
 *
 * @class BudProxyController
 *
 */
@ApiUseTags('bud-proxy')
@ApiBearerAuth()
@Controller('api/v2/bud-proxy')
export class BudProxyController {

    constructor(private readonly budService: BudProxyService) {

    }

    @Get('/metrics/:metric/:link/:sitecode')
    @Header('Content-Type', 'application/json')
    @ApiOperation({title: 'Retrieve network interface metrics from BUD'})
    @ApiImplicitParam({
        name: 'metric',
        description: 'The type of metric being requested eg. inbound, outbound',
        required: true,
        type: 'string',
    })
    @ApiImplicitParam({
        name: 'link',
        description: 'The link or interface being measured eg. wan, internet',
        required: true,
        type: 'string',
    })
    @ApiImplicitParam({
        name: 'sitecode',
        description: 'Site Code for the school. Try 4268 as an example.',
        required: true,
        type: 'number',
    })

    @ApiOkResponse({
        description: 'The response from BUD API.',
        type: ResDto,
    })
    @ApiResponse({
        /* @ApiUnauthorizedResponse ** not released yet **/
        status: 401,
        description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
        type: AuthErrorRes,
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
        type: AuthErrorRes,
    })
    @ApiUnprocessableEntityResponse({
        description: 'Validation Error - A list of the validation and/or business rules violated',
        type: ValidErrorRes,
    })
    @ApiServiceUnavailableResponse({
        description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
        type: PlatErrorRes,
    })
    @ApiRequestTimeoutResponse({
        description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
        type: PlatErrorRes,
    })
    @ApiInternalServerErrorResponse({
        description: 'Server Error - A runtime error to be fixed by developer',
        type: ServerErrorRes,
    })
    async getMetrics(
        @Param('metric') metricType,
        @Param('link') link,
        @Param('sitecode') siteCode,
    ): Promise<ResDto | ErrRes | any> {

        try {
            const data = await this.budService.getMetrics(metricType, link, siteCode);
            Logger.debug(`data ---> ${JSON.stringify(data)}`, 'BudProxyController');
            return data;
        } catch (e) {
            Logger.error(`${e.message}`);
        }
    }
}
