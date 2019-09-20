import { createParamDecorator } from '@nestjs/common';
import * as bodybuilder from 'bodybuilder';
import { Request } from 'jest-express/lib/request';

export const BodyBuilderFactory = (data: string, req) => {
    let b = bodybuilder();

    if (req.query.size) {
        b = b.size(req.query.size);
    }

    if (req.query.model) {
        b = b.query('match', 'model', req.query.model);
    }

    if (req.params.sitecode) {
        b = b.query('match', 'site_code', req.params.sitecode);
    }

    if (req.query.formfactor) {
        b = b.query('match', 'form_factor', req.query.formfactor);
    }

    // Age parameter should be taken to mean "this device is <time period> old"
    if (req.query.age) {
        b = b.query('range', 'release_year', { lte: `now-${req.query.age}` });
    }

    // Warranty parameter should be taken to mean "the warranty will expire in less than <time period>, but has not expired".
    if (req.query.warranty) {
        b = b.query('range', 'warranty', { lte: `now+${req.query.warranty}`, gte: 'now' });
    }

    req.bodybuilder = b;
};

export const BodyBuilder = createParamDecorator(BodyBuilderFactory);

// For requests which have had the bodybuilder attached
export interface IBodyBuilderRequest extends Request {
    bodybuilder: bodybuilder.Bodybuilder;
}
