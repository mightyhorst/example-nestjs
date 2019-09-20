import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {UtilisationModule} from "@components/utilisation/utilisation.module";
import * as path from "path";

describe('/api/v2/devices (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
                UtilisationModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/api/v2/devices (GET) returns all devices paged', () => {
        return request(app.getHttpServer())
            .get('/api/v2/devices')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res.body.hits);
            });
    });

    it('/api/v2/devices/:sitecode returns only devices for that sitecode (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/v2/devices/1809')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect((res) => {
                expect(res.body.hits);
            });
    });
});
