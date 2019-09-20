import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {WarrantyModule} from "@components/warranty/warranty.module";
import * as path from "path";

describe('/api/v2/warranty (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
                WarrantyModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/api/v2/warranty/:sitecode (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/v2/warranty/1809')
            .expect(200);
    });

    it('/api/v2/warranty/:sitecode/chart (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/v2/warranty/1809/chart')
            .expect(200);
    });
});
