import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {FormFactorModule} from "@components/form-factor/form-factor.module";
import * as path from "path";

describe('Form Factor endpoints (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                FormFactorModule,
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });


    /**
    *
    * Form Factor query 
    *
    **/
    describe('/api/v2/form-factor (e2e)', () => {


        /**
        * @param  {number} siteCode - school ID
        **/
        it('GET /api/v2/form-factor/:sitecode', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        "ostype": "Workstation",
                        "os_service_pack": "1709",
                        "site_name": "PananiaPS",
                        "free_hdd_size_gb": 422,
                        "form_factor": "Desktop",
                        "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz",
                        "manufacturer": "Hewlett-Packard",
                        "device_name": "ECB1D747402BP",
                        "sitecode": "1809",
                        "@timestamp": "2019-03-25T03:20:42.552Z",
                        "release_year": "2014-01-01T00:00:00.000Z",
                        "warranty": "2019-12-10T00:00:00.000Z",
                        "serialnumber": "AUD54908Z8",
                        "resourceid": 151021626,
                        "operating_system": "Microsoft Windows 10 Education",
                        "model": "HP EliteDesk 800 G1 SFF",
                        "hdd_size_gb": 465,
                        "last_logon_timestamp0": "2019-03-05T12:34:09.000Z",
                        "total_memory_mb": 8082,
                        "last_logon_user": null,
                        "@version": "1"
                      }

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });






        /**
        * @param  {number} siteCode - school ID
        * @param  {string} warranty - warranty filter
        **/
        it('GET /api/v2/form-factor/:sitecode Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809?warranty=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = {
                        "ostype": "Workstation",
                        "os_service_pack": "1709",
                        "site_name": "PananiaPS",
                        "free_hdd_size_gb": 420,
                        "form_factor": "Desktop",
                        "device_specification": "Intel(R) Pentium(R) CPU G3220 @ 3.00GHz",
                        "manufacturer": "LENOVO",
                        "device_name": "448A5B068ECEP",
                        "sitecode": "1809",
                        "@timestamp": "2019-03-25T03:21:44.636Z",
                        "release_year": "2013-01-01T00:00:00.000Z",
                        "warranty": "2017-01-15T13:00:00.000Z",
                        "serialnumber": "PB00CA5U",
                        "resourceid": 151052634,
                        "operating_system": "Microsoft Windows 10 Education",
                        "model": "ThinkCentre M73",
                        "hdd_size_gb": 465,
                        "last_logon_timestamp0": "2019-02-27T12:28:05.000Z",
                        "total_memory_mb": 4009,
                        "last_logon_user": "DETNSW\\ivy.nguyen27",
                        "@version": "1"
                      }
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param  {number} siteCode - school ID
        * @param  {string} age - age of device filter 
        **/
        it('GET /api/v2/form-factor/:sitecode Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809?age=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        "ostype": "Workstation",
                        "os_service_pack": "1709",
                        "site_name": "PananiaPS",
                        "free_hdd_size_gb": 422,
                        "form_factor": "Desktop",
                        "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz",
                        "manufacturer": "Hewlett-Packard",
                        "device_name": "ECB1D747402BP",
                        "sitecode": "1809",
                        "@timestamp": "2019-03-25T03:20:42.552Z",
                        "release_year": "2014-01-01T00:00:00.000Z",
                        "warranty": "2019-12-10T00:00:00.000Z",
                        "serialnumber": "AUD54908Z8",
                        "resourceid": 151021626,
                        "operating_system": "Microsoft Windows 10 Education",
                        "model": "HP EliteDesk 800 G1 SFF",
                        "hdd_size_gb": 465,
                        "last_logon_timestamp0": "2019-03-05T12:34:09.000Z",
                        "total_memory_mb": 8082,
                        "last_logon_user": null,
                        "@version": "1"
                      }
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} utilisation - utilisation of device filter 
        **/
        it('GET /api/v2/form-factor/:sitecode Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        "last_logon_user": "",
                        "form_factor": "iOS Laptop",
                        "resourceid": "59BC2313-C5B8-5504-BA58-6705C91C2340",
                        "hdd_size_gb": 0,
                        "sitecode": "1809",
                        "last_logon_timestamp0": 1549341952,
                        "manufacturer": "Apple",
                        "site_name": "Panania PS",
                        "device_name": "dca4cae9a4bdACS",
                        "device_specification": "Intel(R) Core(TM) i5-4278U CPU @ 2.60GHz",
                        "serialnumber": "C07T815EG1J1",
                        "@timestamp": "2019-03-21T04:42:12.945Z",
                        "@version": "1",
                        "operating_system": "MacOS",
                        "model": "Macmini7,1",
                        "warranty": "2020-02-20",
                        "os_service_pack": 101204
                      }
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} model - model filter 
        **/
        it('GET /api/v2/form-factor/:sitecode?model={model} Respects filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        "ostype": "Workstation",
                        "os_service_pack": "1709",
                        "site_name": "PananiaPS",
                        "free_hdd_size_gb": 422,
                        "form_factor": "Desktop",
                        "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz",
                        "manufacturer": "Hewlett-Packard",
                        "device_name": "ECB1D747402BP",
                        "sitecode": "1809",
                        "@timestamp": "2019-03-25T03:20:42.552Z",
                        "release_year": "2014-01-01T00:00:00.000Z",
                        "warranty": "2019-12-10T00:00:00.000Z",
                        "serialnumber": "AUD54908Z8",
                        "resourceid": 151021626,
                        "operating_system": "Microsoft Windows 10 Education",
                        "model": "HP EliteDesk 800 G1 SFF",
                        "hdd_size_gb": 465,
                        "last_logon_timestamp0": "2019-03-05T12:34:09.000Z",
                        "total_memory_mb": 8082,
                        "last_logon_user": null,
                        "@version": "1"
                    }

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });


        it('GET /api/v2/form-factor/:sitecode?model={no model} Respects filter by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809?model=No Model found')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [];

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits).toEqual(expected);
                });
        });


    })


    /**
    *
    * Charts query
    *
    **/
    describe('/api/v2/form-factor/chart (e2e)', () => {

        /**
        * @param  {number} siteCode - school ID
        **/
        it('GET /api/v2/form-factor/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        {
                          "name": "Desktop",
                          "y": 158
                        },
                        {
                          "name": "Laptop",
                          "y": 52
                        },
                        {
                          "name": "Servers",
                          "y": 1
                        },
                        {
                          "name": "iOS Laptop",
                          "y": 1
                        }
                    ]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });






        /**
        * @param  {number} siteCode - school ID
        * @param  {string} warranty - warranty filter
        **/
        it('GET /api/v2/form-factor/:sitecode/chart Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart?warranty=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = [
                        {
                              "name": "Desktop",
                              "y": 91
                            },
                            {
                              "name": "Laptop",
                              "y": 19
                        }
                    ]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param  {number} siteCode - school ID
        * @param  {string} age - age of device filter 
        **/
        it('GET /api/v2/form-factor/:sitecode/chart Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart?age=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        {
                          "name": "Desktop",
                          "y": 157
                        },
                        {
                          "name": "Laptop",
                          "y": 52
                        },
                        {
                          "name": "Servers",
                          "y": 1
                        }
                    ]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} utilisation - utilisation of device filter 
        **/
        it('GET /api/v2/form-factor/:sitecode/chart Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        {
                          "name": "iOS Laptop",
                          "y": 1
                        }
                    ]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} model - model filter 
        **/
        it('GET /api/v2/form-factor/:sitecode?model={model} Respects filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        {
                              "name": "Desktop",
                              "y": 23
                        }
                    ]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


        it('GET /api/v2/form-factor/:sitecode/chart?model={no model} Respects filter by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/form-factor/1809/chart?model=No Model found')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [];

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


    })
});
