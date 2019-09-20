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
    ApiRequestTimeoutResponse,
} from '@nestjs/swagger';

/**
 * @import Endpoint
 **/
import {
    Controller,
    Get,
    Query,
    Param, UseGuards,
} from '@nestjs/common';

/**
 * @import Services
 **/
import {SchoolsService} from '../service/schools.service';

/**
 * @import Responses
 **/
import {
    SchoolsResponseDto,
    SchoolsErrorResponseDto,
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
    AuthError,
} from '@errors/index';
import {AuthGuard} from '@nestjs/passport';

/**
 *
 * @class SchoolsController
 *
 **/
@ApiUseTags('schools')
@ApiBearerAuth()
@Controller('api/v2/schools')
export class SchoolsController {

    constructor(private readonly schoolsService: SchoolsService) {

    }

    /**
     *
     * GET /api/v2/schools/{sitecode}
     *
     **/
    @Get(':sitecode')
    @ApiOperation({title: 'Directly query Elastic Search'})
    @ApiImplicitParam({
        name: 'sitecode',
        description: 'Site Code for the school. Try 4268 as an example.',
        required: true,
        type: 'number',
    })
    // @ApiImplicitQuery({
    //     name: 'size',
    //     description: 'Optionally limit the size of items returned for pagination and optimizing load times',
    //     required: false,
    //     type: 'number'
    // })
    @ApiOkResponse({
        // status: 200,
        description: 'The response from elastic search.',
        type: SchoolsResponseDto,
    })
    @ApiResponse({
        /* @ApiUnauthorizedResponse ** not released yet **/
        status: 401,
        description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
        type: AuthError,
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
        type: AuthError,
    })
    @ApiUnprocessableEntityResponse({
        description: 'Validation Error - A list of the validation and/or business rules violated',
        type: ValidationError,
    })
    @ApiInternalServerErrorResponse({
        description: 'Server Error - A runtime error to be fixed by developer',
        type: ServerError,
    })
    @ApiServiceUnavailableResponse({
        description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
        type: IntegrationError,
    })
    @ApiRequestTimeoutResponse({
        description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
        type: IntegrationError,
    })
    @UseGuards(AuthGuard('jwt'))
    async findOne(@Param('sitecode') sitecode): Promise<SchoolsResponseDto | SchoolsErrorResponseDto> {
        const searchResults = await this.schoolsService.findOne(sitecode);

        let response: SchoolsResponseDto | SchoolsErrorResponseDto;
        if (true) {
            response = new SchoolsResponseDto(searchResults);
        } else {
            const httpError = new HttpError(500, ErrorType.Server, 'Error - todo');
            response = new SchoolsErrorResponseDto(searchResults, httpError);
        }
        return Promise.resolve(response);
    }

    /**
     * GET /api/v2/schools
     */
    @Get()
    @ApiOperation({title: 'Directly query Elastic Search'})
    @ApiImplicitQuery({
        name: 'size',
        description: 'Optionally limit the size of items returned for pagination and optimizing load times',
        required: false,
        type: 'number',
    })
    @ApiOkResponse({
        // status: 200,
        description: 'The response from elastic search.',
        type: SchoolsResponseDto,
    })
    @ApiResponse({
        /* @ApiUnauthorizedResponse ** not released yet **/
        status: 401,
        description: 'Unauthorized. You aren’t authenticated–either not authenticated at all or authenticated incorrectly–but please reauthenticate and try again',
        type: AuthError,
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
        type: AuthError,
    })
    @ApiUnprocessableEntityResponse({
        description: 'Validation Error - A list of the validation and/or business rules violated',
        type: ValidationError,
    })
    @ApiInternalServerErrorResponse({
        description: 'Server Error - A runtime error to be fixed by developer',
        type: ServerError,
    })
    @ApiServiceUnavailableResponse({
        description: 'Integration Error - problem downstream with ElasticSearch or Identity Provider',
        type: IntegrationError,
    })
    @ApiRequestTimeoutResponse({
        description: 'Timeout Error - most likely a problem downstream with ElasticSearch or Identity Provider',
        type: IntegrationError,
    })
    @UseGuards(AuthGuard('jwt'))
    async findAll(
        @Query('limit') limit,
        @Query('offset') offset,
        @Query('sort') sort,
        @Query('filter') filter,
        @Query('query') query,
    ): Promise<SchoolsResponseDto | SchoolsErrorResponseDto> {
        const searchResults = await this.schoolsService.findAll(
            limit,
            offset,
            sort,
            filter,
            query,
        );

        let response: SchoolsResponseDto | SchoolsErrorResponseDto;
        if (true) {
            response = new SchoolsResponseDto(searchResults);
        } else {
            const httpError = new HttpError(500, ErrorType.Server, 'Error - todo');
            response = new SchoolsErrorResponseDto(searchResults, httpError);
        }
        return Promise.resolve(response);
    }
}
