const chalk = require('chalk');

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
} from '@nestjs/common';

import {
    Request,
    Response
} from 'express';

import {
    ErrorResponseDto,
    AuthErrorResponseDto,
    ValidationErrorResponseDto,
    IntegrationErrorResponseDto,
    ServerErrorResponseDto,
} from '@responses/index';

@Catch(ErrorResponseDto)
export class ErrorFilter implements ExceptionFilter {

    catch(errDto: ErrorResponseDto, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        /**
         * Environments Manipulate
         * @todo - special cases
         */
        if (errDto instanceof AuthErrorResponseDto)
            console.log(chalk.yellow.inverse('ExceptionFilter.AuthErrorResponseDto\n'), errDto);

        if (errDto instanceof ValidationErrorResponseDto)
            console.log(chalk.magenta.inverse('ExceptionFilter.ValidationErrorResponseDto\n'), errDto);

        if (errDto instanceof IntegrationErrorResponseDto)
            console.log(chalk.cyan.inverse('ExceptionFilter.IntegrationErrorResponseDto\n'), errDto);

        if (errDto instanceof ServerErrorResponseDto)
            console.log(chalk.red.inverse('ExceptionFilter.ServerErrorResponseDto\n'), errDto);


        /**
         * Environments Manipulate
         * @todo production error handling
         */
        var status = errDto.error ? errDto.error.code : 0,
            json = errDto.error.toJson();

        switch (process.env.NODE_ENV) {

            case 'production': {
                /**
                 * @todo porduction error handling
                 */
                break;
            }

        }

        res.status(status).json(json);
    }
}
