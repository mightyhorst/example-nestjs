import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, HttpService } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { UtilisationModule } from '@components/utilisation/utilisation.module';
import { AuthModule } from '@auth/auth.module';
import { defer, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as path from 'path';
import { getToken } from './helpers/backdoor.service'
const chalk = require('chalk');

describe('/api/v2/utilisation (e2e)', () => {
    let app: INestApplication|any;
    let jwt: string;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', '')
                }),
                UtilisationModule,
                AuthModule
            ],
            providers: [
            ]
        }).compile();

        app = moduleFixture.createNestApplication();    

        await app.init();
    });

    beforeAll(async ()=>{

        try{
            let token = await getToken();
            jwt = `JWT ${token}`;
        }
        catch(err){
            throw new Error(`You must include a backdoorToken`);
        }
    })

    /**
    *
    * Utilisation query 
    *
    **/
    describe('/api/v2/utilisation (e2e)', () => {


        /**
        * @param {number} siteCode - school ID
        **/
        it('GET /api/v2/utilisation/:sitecode', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });




        /**
        * @param {number} siteCode - school ID
        * @param {string} formFactor - formFactor filter
        **/
        it('GET /api/v2/utilisation/:sitecode Respects filter by Form Factor', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?formfactor=Desktop')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });



        /**
        * @param {number} siteCode - school ID
        * @param {string} warranty - warranty filter
        **/
        it('GET /api/v2/utilisation/:sitecode Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?warranty=1y')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = {"@timestamp": "2019-03-25T03:21:44.636Z", "@version": "1", "device_name": "448A5B068ECEP", "device_specification": "Intel(R) Pentium(R) CPU G3220 @ 3.00GHz", "form_factor": "Desktop", "free_hdd_size_gb": 420, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-02-27T12:28:05.000Z", "last_logon_user": "DETNSW\\ivy.nguyen27", "manufacturer": "LENOVO", "model": "ThinkCentre M73", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2013-01-01T00:00:00.000Z", "resourceid": 151052634, "serialnumber": "PB00CA5U", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 4009, "warranty": "2017-01-15T13:00:00.000Z"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param {number} siteCode - school ID
        * @param {string} age - age of device filter 
        **/
        it('GET /api/v2/utilisation/:sitecode Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?age=1y')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });





        /**
        * @param {number} siteCode - school ID
        * @param {string} utilisation - utilisation of device filter 
        **/
        it.skip('GET /api/v2/utilisation/:sitecode Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        
                    }
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });





        /**
        * @param {number} siteCode - school ID
        * @param {string} model - model filter 
        **/
        it('GET /api/v2/utilisation/:sitecode?model={model} Should ignore filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?model=HP EliteDesk 800 G1 SFF')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });
        


        it('GET /api/v2/utilisation/:sitecode?model={no model} Should ignore by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809?model=No Model found')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"};

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });
        

    })


    /**
    *
    * Charts query
    *
    **/
    describe('/api/v2/utilisation/chart (e2e)', () => {

        /**
        * @param {number} siteCode - school ID
        **/
        it('GET /api/v2/utilisation/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected =  [{"name": "past 7 days", "y": 208}, {"name": "between 8 and 14 days", "y": 54}, {"name": "between 15 and 30 days", "y": 31}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param {number} formFactor - form factor
        **/
        it('GET /api/v2/utilisation/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?formfactor=Desktop')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "past 7 days", "y": 155}, {"name": "between 8 and 14 days", "y": 40}, {"name": "between 15 and 30 days", "y": 22}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });






        /**
        * @param {number} siteCode - school ID
        * @param {string} warranty - warranty filter
        **/
        it('GET /api/v2/utilisation/:sitecode/chart Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?warranty=1y')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = [{"name": "past 7 days", "y": 107}, {"name": "between 8 and 14 days", "y": 23}, {"name": "between 15 and 30 days", "y": 7}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param {number} siteCode - school ID
        * @param {string} age - age of device filter 
        **/
        it('GET /api/v2/utilisation/:sitecode/chart Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?age=1y')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "past 7 days", "y": 207}, {"name": "between 8 and 14 days", "y": 54}, {"name": "between 15 and 30 days", "y": 31}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });





        /**
        * @param {number} siteCode - school ID
        * @param {string} utilisation - utilisation of device filter 
        **/
        it.skip('GET /api/v2/utilisation/:sitecode/chart Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        
                    ]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param {number} siteCode - school ID
        * @param {string} model - model filter 
        * @should ignore 
        **/
        it('GET /api/v2/utilisation/:sitecode?model={model} Respects filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?model=HP EliteDesk 800 G1 SFF')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected =  [{"name": "past 7 days", "y": 208}, {"name": "between 8 and 14 days", "y": 54}, {"name": "between 15 and 30 days", "y": 31}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


        it('GET /api/v2/utilisation/:sitecode/chart?model={no model} Respects filter by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/utilisation/1809/chart?model=No Model found')
                .set('Authorization', jwt)
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "past 7 days", "y": 208}, {"name": "between 8 and 14 days", "y": 54}, {"name": "between 15 and 30 days", "y": 31}];

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


    })
});

