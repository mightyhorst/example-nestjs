/**
* @requires Swagger
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
* @requires Endpoint
**/
import {
    Controller,
    Get,
    Query,
    Param,
    Logger, 
    UseGuards,
    Res,
    Render
} from '@nestjs/common';

import { Response } from 'express';


/**
 * @requires Services
 **/
import { DevicesService } from '../service/devices.service';
import { ISortRules } from '@services/services.module';
import { Parser } from 'json2csv';
import * as moment from 'moment';

/**
* @requires Responses
**/
import {
    DevicesResponseDto as ResDto,
    DevicesCsvDto as CsvDto,
    DevicesErrorResponseDto as ErrDto,
} from '../dto/index';

/**
 * @requires Errors
 **/
import {
    HttpError,
    ErrorType,
    ServerError,
    ValidationError,
    IntegrationError,
    AuthError,
} from '@errors/index';

/**
* @enum Enums
**/
import {
    FormFactorEnum,
    WarrantyEnum,
} from '@models/index';
import {DevicesCountResponseDto} from '@components/devices/dto/devices.count.response.dto';
import {AuthGuard} from '@nestjs/passport';

/**
* @requires Types
**/
import { WarrantyTypes } from '@components/warranty/types';
import { AgeRanges } from '@components/age/types';
import { UtilisationTypes } from '@components/utilisation/types';
import { FormFactorTypes } from '@components/form-factor/index';

/**
*
* @class DevicesController
*
**/
@ApiUseTags('devices')
@ApiBearerAuth()
@Controller('api/v2/devices')
export class DevicesController {

    constructor(private readonly devices: DevicesService) {

    }

    /**
    *
    * GET /api/v2/devices/{sitecode}/count
    *
    **/
    @Get(':sitecode/count')
    @ApiOperation({title: 'Get the number of devices at a particular site'})
    @ApiOkResponse({
        description: 'The count of devices for the specified site.',
        type: DevicesCountResponseDto,
    })
    @ApiForbiddenResponse({
        description: 'Forbidden. I’m sorry. I know who you are–I believe who you say you are–but you just don’t have permission to access this resource. Maybe if you ask the system administrator nicely, you’ll get permission.',
        type: AuthError,
    })
    @ApiInternalServerErrorResponse({
        description: 'Server Error - A runtime error to be fixed by developer',
        type: ServerError,
    })
    @UseGuards(AuthGuard('jwt'))
    async count(@Param('sitecode') sitecode): Promise<DevicesCountResponseDto> {
        const deviceCount = await this.devices.count(sitecode);
        return new DevicesCountResponseDto(deviceCount);
    }

    /**
    *
    * GET /api/v2/devices/{sitecode}
    *
    **/
    @Get(':sitecode')
    @ApiOperation({title: 'Directly query Elastic Search'})
    /**
    * @name Params 
    **/
    @ApiImplicitParam({
        name:         'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required:      true, 
        type:          'number'
    })
    /**
    * @name Query  
    **/
    @ApiImplicitQuery({
        name:         'formfactor', 
        description: '(Optional) formfactor - filter based on formfactor', 
        required:      false, 
        type:          'string',
        enum:          ['macos_laptop', 'macos_desktop', 'chromedevice', 'servers', 'desktop', 'laptop', 'unknown']
    })    
    @ApiImplicitQuery({
        name:         'warranty', 
        description: '(Optional) warranty - filter based on warranty', 
        required:      false, 
        type:          'string',
        enum:          ['expired','expiring_soon','covered']
    })
    @ApiImplicitQuery({
        name:         'age', 
        description: '(Optional) age - filter based on age of device', 
        required:      false, 
        type:          'string',
        enum:          ['1_year_old', '2_years_old', '3_years_old', '4_years_old', '5_plus_years_old']
    })
    @ApiImplicitQuery({
        name:         'utilisation',
        description: '(Optional) utilisation - filter based on utilisation',
        required:      false, 
        type:          'string',
        enum:          ['this_week', 'last_week','several_weeks_ago', 'over_30_days_old']
    })
    @ApiImplicitQuery({
        name:         'model',
        description: '(Optional) model - filter based on model',
        required:      false, 
        type:          'string'
    })
    @ApiImplicitQuery({
        name:         'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'from', 
        description: 'Optionally page from the supplied index', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'to', 
        description:  'Optionally paginate to the supplied index', 
        required:     false, 
        type:         'number'
    })
    @ApiImplicitQuery({
        name:          'sort', 
        description:   'Optional sort rules', 
        required:      false, 
        type:          'string',
        //enum:          ['', 'asc', 'desc']
    })
    /**
    * @name Responses 
    **/    
    @ApiOkResponse({
        description: 'The response from elastic search.',
        type: ResDto,
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
    async search(
        @Param('sitecode') sitecode:number, 
        @Query('formfactor') formFactor?:FormFactorTypes,
        @Query('warranty') warranty?:WarrantyTypes,
        @Query('age') ageOfDevice?:AgeRanges,
        @Query('utilisation') utilisation?:UtilisationTypes,
        @Query('model') model?:string, 
        @Query('size') size?:number,
        @Query('from') fromIndex?:number,
        @Query('to')   toIndex?:number,
        @Query('sort') sort?:string
    ): Promise<ResDto|ErrDto> {
        
        if(size == -1) size = 10000;

        let searchResults;
        let response: ResDto | ErrDto;

        let sortRules:ISortRules[] = [];
        if (sort) {
            sortRules = JSON.parse(sort);
        }

        try {
            searchResults = await this.devices.search(
                sitecode,
                formFactor,
                warranty,
                ageOfDevice,
                utilisation,
                model,
                size,
                fromIndex,
                toIndex, 
                sortRules,
            );
            response = new ResDto(searchResults);
            return Promise.resolve(response);

        } catch (err) {
            
            Logger.error(err.toString());
            if (err instanceof IntegrationError) {
                /**@todo  optional processing **/
            }
            response = new ErrDto(searchResults, err);
            return Promise.reject(response);

        }
    }



    /**
    *
    * GET /api/v2/devices/{sitecode}/csv
    *
    **/
    @Get(':sitecode/csv')
    @ApiOperation({title: 'Download as CSV'})
    /**
    * @name Params 
    **/
    @ApiImplicitParam({
        name:         'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required:      true, 
        type:          'number'
    })
    /**
    * @name Query  
    **/
    @ApiImplicitQuery({
        name:         'formfactor', 
        description: '(Optional) formfactor - filter based on formfactor', 
        required:      false, 
        type:          'string',
        enum:          ['macos_laptop', 'macos_desktop', 'chromedevice', 'servers', 'desktop', 'laptop', 'unknown']
    })    
    @ApiImplicitQuery({
        name:         'warranty', 
        description: '(Optional) warranty - filter based on warranty', 
        required:      false, 
        type:          'string',
        enum:          ['expired','expiring_soon','covered']
    })
    @ApiImplicitQuery({
        name:         'age', 
        description: '(Optional) age - filter based on age of device', 
        required:      false, 
        type:          'string',
        enum:          ['1_year_old', '2_years_old', '3_years_old', '4_years_old', '5_plus_years_old']
    })
    @ApiImplicitQuery({
        name:         'utilisation',
        description: '(Optional) utilisation - filter based on utilisation',
        required:      false, 
        type:          'string',
        enum:          ['this_week', 'last_week','several_weeks_ago', 'over_30_days_old']
    })
    @ApiImplicitQuery({
        name:         'model',
        description: '(Optional) model - filter based on model',
        required:      false, 
        type:          'string'
    })
    @ApiImplicitQuery({
        name:         'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'from', 
        description: 'Optionally page from the supplied index', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'to', 
        description:  'Optionally paginate to the supplied index', 
        required:     false, 
        type:         'number'
    })
    @ApiImplicitQuery({
        name:          'sort', 
        description:   'Optional sort rules', 
        required:      false, 
        type:          'string',
        //enum:          ['', 'asc', 'desc']
    })
    @ApiImplicitQuery({
        name:          'token', 
        description:   'JWT token to authn/authz request', 
        required:      true, 
        type:          'string'
    })
    /**
    * @name Responses 
    **/    
    @ApiOkResponse({
        description: 'CSV download.',
        type: 'string',
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
    // @UseGuards(AuthGuard('jwt'))
    async getCsv(
        @Res() res:Response,
        @Param('sitecode') sitecode:number, 
        @Query('token') token:string,
        @Query('formfactor') formFactor?:FormFactorTypes,
        @Query('warranty') warranty?:WarrantyTypes,
        @Query('age') ageOfDevice?:AgeRanges,
        @Query('utilisation') utilisation?:UtilisationTypes,
        @Query('model') model?:string, 
        @Query('size') size?:number,
        @Query('from') fromIndex?:number,
        @Query('to')   toIndex?:number,
        @Query('sort') sort?:string,
    ){

        /**
        * @todo token to authn/authz
        **/
        console.log('token to authn/authz', token);

        try{
            var csvData = await this.search(
                sitecode,
                formFactor,
                warranty,
                ageOfDevice,
                utilisation,
                model,
                size,
                fromIndex,
                toIndex, 
                sort,
            );

            // const warrantyLabels = ['Expired', 'Expires Soon', 'In Warranty'];
            
            csvData = csvData.data.hits.hits.map(hit => {
                let src = hit._source;
                return {
                    'Device Name': src.device_name,
                    'Site Code': src.sitecode,
                    'Operating System': src.operating_system,
                    'Make/Manufacturer': src.manufacturer,
                    'Serial Number': (src.serialnumber != null ? ""+src.serialnumber+" " : ""),
                    'Form Factor': src.form_factor,
                    
                    'Warranty Expires': (src.warranty == 0 ?  '' : moment(src.warranty).format("DD/MM/YYYY") ),
                    'Device Specification': src.device_specification,
                    'Device Memory': (src.total_memory_mb > 0 ? Math.round(src.total_memory_mb/1000)+' GB' : ''),
                    'Local Disk': (src.hdd_size_gb > 0 ? src.hdd_size_gb+' GB' : ''),
                    /** @param lastLogonUser disabled  'Last Logged on User': src.last_logon_user, **/
                    //'Last logged on': (src.last_logon_timestamp0 && this.devices.validDate(src.last_logon_timestamp0) ? moment.duration(moment(new Date()).diff(src.last_logon_timestamp0)).humanize()  : ''),
                    'Last logged on': (src.last_logon_timestamp0 && this.devices.validDate(src.last_logon_timestamp0) ? moment(src.last_logon_timestamp0).format("DD/MM/YYYY")  : ''),
                    'Age of Device': (src.release_year && this.devices.validDate(src.release_year) ? moment.duration(moment(new Date()).diff(src.release_year)).humanize()  : ''),
                    'Device Utilisation': (src.last_logon_timestamp0  && this.devices.validDate(src.last_logon_timestamp0) ? moment.duration(moment(new Date()).diff(src.last_logon_timestamp0)).humanize() : ''),

                    'Model': src.model,
                };
            })
            
            const columnNames = [
                'Device Name',
                'Site Code',
                'Operating System',
                'Make/Manufacturer',
                'Serial Number',
                'Form Factor',
                'Warranty Expires',
                'Device Specification',
                'Device Memory',
                'Local Disk',
                /** @param lastLogonUser disabled 'Last Logged on User', **/
                'Last logged on',
                'Age of Device',
                'Device Utilisation',
                'Model'
            ];

            const json2csvParser = new Parser({ columnNames });
            const csv = json2csvParser.parse(csvData);

            res.attachment(`device-data-site-${sitecode}.csv`);
            res.status(200).send(csv);
            
        }
        catch(err){
            res.status(500).json({err:err});
        }
    }


    /**
    *
    * GET /api/v2/devices/{sitecode}/print
    *
    **/
    @Get(':sitecode/print')
    @ApiOperation({title: 'Printable view'})
    /**
    * @name Params 
    **/
    @ApiImplicitParam({
        name:         'sitecode', 
        description: 'Site Code for the school. Try 4268 as an example.', 
        required:      true, 
        type:          'number'
    })
    /**
    * @name Query  
    **/
    @ApiImplicitQuery({
        name:         'formfactor', 
        description: '(Optional) formfactor - filter based on formfactor', 
        required:      false, 
        type:          'string',
        enum:          ['macos_laptop', 'macos_desktop', 'chromedevice', 'servers', 'desktop', 'laptop', 'unknown']
    })    
    @ApiImplicitQuery({
        name:         'warranty', 
        description: '(Optional) warranty - filter based on warranty', 
        required:      false, 
        type:          'string',
        enum:          ['expired','expiring_soon','covered']
    })
    @ApiImplicitQuery({
        name:         'age', 
        description: '(Optional) age - filter based on age of device', 
        required:      false, 
        type:          'string',
        enum:          ['1_year_old', '2_years_old', '3_years_old', '4_years_old', '5_plus_years_old']
    })
    @ApiImplicitQuery({
        name:         'utilisation',
        description: '(Optional) utilisation - filter based on utilisation',
        required:      false, 
        type:          'string',
        enum:          ['this_week', 'last_week','several_weeks_ago', 'over_30_days_old']
    })
    @ApiImplicitQuery({
        name:         'model',
        description: '(Optional) model - filter based on model',
        required:      false, 
        type:          'string'
    })
    @ApiImplicitQuery({
        name:         'size', 
        description: 'Optionally limit the size of items returned for pagination and optimizing load times', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'from', 
        description: 'Optionally page from the supplied index', 
        required:      false, 
        type:          'number'
    })
    @ApiImplicitQuery({
        name:         'to', 
        description:  'Optionally paginate to the supplied index', 
        required:     false, 
        type:         'number'
    })
    @ApiImplicitQuery({
        name:          'sort', 
        description:   'Optional sort rules', 
        required:      false, 
        type:          'string',
        //enum:          ['', 'asc', 'desc']
    })
    @ApiImplicitQuery({
        name:          'token', 
        description:   'JWT token to authn/authz request', 
        required:      true, 
        type:          'string'
    })
    /**
    * @name Responses 
    **/    
    @ApiOkResponse({
        description: 'CSV download.',
        type: 'string',
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
    // @UseGuards(AuthGuard('jwt'))
    @Render('print')
    async getPrintView(
        @Res() res:Response,
        @Param('sitecode') sitecode:number, 
        @Query('token') token:string,
        @Query('formfactor') formFactor?:FormFactorTypes,
        @Query('warranty') warranty?:WarrantyTypes,
        @Query('age') ageOfDevice?:AgeRanges,
        @Query('utilisation') utilisation?:UtilisationTypes,
        @Query('model') model?:string, 
        @Query('size') size?:number,
        @Query('from') fromIndex?:number,
        @Query('to')   toIndex?:number,
        @Query('sort') sort?:string,
    ){

        /**
        * @todo token to authn/authz
        **/
        console.log('token to authn/authz', token);

        try{
            var tableData = await this.search(
                sitecode,
                formFactor,
                warranty,
                ageOfDevice,
                utilisation,
                model,
                size,
                fromIndex,
                toIndex, 
                sort,
            );

            // const warrantyLabels = ['Expired', 'Expires Soon', 'In Warranty'];
            
            tableData = tableData.data.hits.hits.map(hit => {
                let src = hit._source;
                return {
                    'Device Name': src.device_name,
                    'Site Code': src.sitecode,
                    'Operating System': src.operating_system,
                    'Make/Manufacturer': src.manufacturer,
                    'Serial Number': (src.serialnumber != null ? ""+src.serialnumber+" " : ""),
                    'Form Factor': src.form_factor,
                    'Warranty Expires': (src.warranty == 0 ?  '' : moment(src.warranty).format("DD/MM/YYYY") ),
                    'Device Specification': src.device_specification,
                    'Device Memory': (src.total_memory_mb > 0 ? Math.round(src.total_memory_mb/1000)+' GB' : ''),
                    'Local Disk': (src.hdd_size_gb > 0 ? src.hdd_size_gb+' GB' : ''),
                    /** @param lastLogonUser disabled  'Last Logged on User': src.last_logon_user, **/
                    //'Last logged on': (src.last_logon_timestamp0 && this.devices.validDate(src.last_logon_timestamp0) ? moment.duration(moment(new Date()).diff(src.last_logon_timestamp0)).humanize()  : ''),
                    'Last logged on': (src.last_logon_timestamp0 && this.devices.validDate(src.last_logon_timestamp0) ? moment(src.last_logon_timestamp0).format("DD/MM/YYYY")  : ''),
                    'Age of Device': (src.release_year && this.devices.validDate(src.release_year) ? moment.duration(moment(new Date()).diff(src.release_year)).humanize()  : ''),
                    'Device Utilisation': (src.last_logon_timestamp0  && this.devices.validDate(src.last_logon_timestamp0) ? moment.duration(moment(new Date()).diff(src.last_logon_timestamp0)).humanize() : ''),
                    'Model': src.model,
                };
            })
            
            const tableColumnNames = [
                {'name': 'Device Name'},
                {'name': 'Site Code'},
                {'name': 'Operating System'},
                {'name': 'Make/Manufacturer'},
                {'name': 'Serial Number'},
                {'name': 'Form Factor'},
                {'name': 'Warranty Expires'},
                {'name': 'Device Specification'},
                {'name': 'Device Memory'},
                {'name': 'Local Disk'},
                /** @param lastLogonUser disabled  {'name': 'Last Logged on User'}, **/
                {'name': 'Last logged on'},
                {'name': 'Age of Device'},
                {'name': 'Device Utilisation'},
                {'name': 'Model'}
            ];

            return {
                table: {
                    columns: tableColumnNames, 
                    data: tableData
                }
            }
            
        }
        catch(err){
            res.status(500).json({err:err});
        }
    }

}
