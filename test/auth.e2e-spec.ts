import { readFileSync } from 'fs';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {ConfigModule} from 'nestjs-config';
import { AuthModule } from '@auth/auth.module';

import { INestApplication } from '@nestjs/common';
import * as path from "path";

describe('when logging in from the SAML SSO portal', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
                AuthModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    it('Sends unauthenticated users to the portal using HTTP-Redirect binding at /auth/saml/redirect', () => {
        return request(app.getHttpServer())
            .get('/auth/saml/redirect')
            .expect(302)
            .expect('Location', /\/sso\/SSOPOST\/metaAlias\/idp\?SAMLRequest=/);
    });

    it('Accepts a SAML Assertion using HTTP-POST binding at /auth/saml/callback and redirects to the token route', () => {
        const assertionData = readFileSync(__dirname + '/fixtures/assertion.xml');
        return request(app.getHttpServer())
            .post('/auth/saml/callback')
            .set('Content-Type', 'text/xml')
            .send(assertionData)
            .expect(302)
            .expect('Location', '/#/token/something');
    });

    it('DUB-598: Accepts a SAML Assertion using HTTP-POST binding at /auth/saml/callback for problematic user david.c38', () => {
        const assertionData = readFileSync(__dirname + '/fixtures/saml.test.david.campbell38-robert-townson-hs.xml');
        return request(app.getHttpServer())
            .post('/auth/saml/callback')
            .set('Content-Type', 'text/xml')
            .send(assertionData)
            .expect(302)
            .expect('Location', '/#/token/something');
    });

    it('DUB-598: Accepts a SAML Assertion using HTTP-POST binding at /auth/saml/callback for problematic user emma.QUINN6', () => {
        const assertionData = readFileSync(__dirname + '/fixtures/saml.test.emma.quinn6-mulwala-ps.xml');
        return request(app.getHttpServer())
            .post('/auth/saml/callback')
            .set('Content-Type', 'text/xml')
            .send(assertionData)
            .expect(302)
            .expect('Location', '/#/token/something');
    });
});