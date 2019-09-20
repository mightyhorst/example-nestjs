const chalk = require('chalk');

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost, UnauthorizedException,
} from '@nestjs/common';

import {
    Request,
    Response,
} from 'express';

@Catch(UnauthorizedException)
export class SAMLUnauthorizedFilter implements ExceptionFilter {

    catch(err: UnauthorizedException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        res.redirect('/#/auth/failure');
    }
}
