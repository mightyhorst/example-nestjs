import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import { AgeModule } from "@components/age/age.module";
import * as path from "path";


/**
* @name Age of Devices API 
* @description api test  
* @todo - validate these are the expected values 
**/
describe('/api/v2/age (e2e)', () => {
    let app: INestApplication|any;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
                AgeModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    /**
    *
    * Age of Devices query 
    *
    **/
    describe('/api/v2/age (e2e)', () => {


        /**
        * @param {number} siteCode - school ID
        **/
        it('GET /api/v2/age/:sitecode', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809')
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
        it('GET /api/v2/age/:sitecode Respects filter by Form Factor', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?formfactor=Desktop')
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
        it('GET /api/v2/age/:sitecode Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?warranty=1y')
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
        * @param {string} age - age of device filter 
        **/
        it.skip('GET /api/v2/age/:sitecode Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?age=1y')
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
        * @param {string} utilisation - utilisation of device filter 
        **/
        it('GET /api/v2/age/:sitecode Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?utilisation=1y')
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
        * @param {string} model - model filter 
        * @should - be ignored
        **/
        it('GET /api/v2/age/:sitecode?model={model} Should ignore filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    expect(res.body.data.hits.hits.length).toBeLessThanOrEqual(10);
                });
        });
        


        it('GET /api/v2/age/:sitecode?model={no model} Should ignore by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809?model=No Model found')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"};

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    expect(res.body.data.hits.hits.length).toBeGreaterThanOrEqual(10);
                });
        });
        

    })


    /**
    *
    * Charts query
    *
    **/
    describe('/api/v2/age/chart (e2e)', () => {

        /**
        * @param {number} siteCode - school ID
        **/
        it('GET /api/v2/age/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param {number} formFactor - form factor
        **/
        it('GET /api/v2/age/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?formfactor=Desktop')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });






        /**
        * @param {number} siteCode - school ID
        * @param {string} warranty - warranty filter
        **/
        it('GET /api/v2/age/:sitecode/chart Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?warranty=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param {number} siteCode - school ID
        * @param {string} age - age of device filter 
        **/
        it.skip('GET /api/v2/age/:sitecode/chart Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?age=1y')
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
        * @param {string} utilisation - utilisation of device filter 
        **/
        it('GET /api/v2/age/:sitecode/chart Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param {number} siteCode - school ID
        * @param {string} model - model filter 
        * @should ignore 
        **/
        it('GET /api/v2/age/:sitecode?model={model} Respects filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


        it('GET /api/v2/age/:sitecode/chart?model={no model} Respects filter by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/age/1809/chart?model=No Model found')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "5_plus_years_old", "y": 143}, {"name": "4_years_old", "y": 44}, {"name": "3_years_old", "y": 5}, {"name": "2_years_old", "y": 10}, {"name": "1_year_old", "y": 0}];

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


    })

})