import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {ConfigModule} from 'nestjs-config';
import {ModelCountModule} from "@components/model-count/model-count.module";
import * as path from "path";


/**
* @name Model Count API 
* @description api test  
* @todo - validate these are the expected values 
**/
describe('/api/v2/model-count (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname, '**/!(*.d).config.{ts,js}'), {
                    modifyConfigName: name => name.replace('.config', ''),
                }),
                ModelCountModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    /**
    *
    * Model Count query 
    *
    **/
    describe('/api/v2/model-count (e2e)', () => {


        /**
        * @param  {number} siteCode - school ID
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });




        /**
        * @param  {number} siteCode - school ID
        * @param  {string} formFactor - formFactor filter
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode Respects filter by Form Factor', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?formfactor=Desktop')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });



        /**
        * @param  {number} siteCode - school ID
        * @param  {string} warranty - warranty filter
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?warranty=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = {"@timestamp": "2019-03-25T03:21:44.636Z", "@version": "1", "device_name": "448A5B068ECEP", "device_specification": "Intel(R) Pentium(R) CPU G3220 @ 3.00GHz", "form_factor": "Desktop", "free_hdd_size_gb": 420, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-02-27T12:28:05.000Z", "last_logon_user": "DETNSW\\ivy.nguyen27", "manufacturer": "LENOVO", "model": "ThinkCentre M73", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2013-01-01T00:00:00.000Z", "resourceid": 151052634, "serialnumber": "PB00CA5U", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 4009, "warranty": "2017-01-15T13:00:00.000Z"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param  {number} siteCode - school ID
        * @param  {string} age - age of device filter 
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?age=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-25T03:20:42.552Z", "@version": "1", "device_name": "ECB1D747402BP", "device_specification": "Intel(R) Core(TM) i5-4590 CPU @ 3.30GHz", "form_factor": "Desktop", "free_hdd_size_gb": 422, "hdd_size_gb": 465, "last_logon_timestamp0": "2019-03-05T12:34:09.000Z", "last_logon_user": null, "manufacturer": "Hewlett-Packard", "model": "HP EliteDesk 800 G1 SFF", "operating_system": "Microsoft Windows 10 Education", "os_service_pack": "1709", "ostype": "Workstation", "release_year": "2014-01-01T00:00:00.000Z", "resourceid": 151021626, "serialnumber": "AUD54908Z8", "site_name": "PananiaPS", "sitecode": "1809", "total_memory_mb": 8082, "warranty": "2019-12-10T00:00:00.000Z"};
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                    
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} utilisation - utilisation of device filter 
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"@timestamp": "2019-03-21T04:42:12.945Z", "@version": "1", "device_name": "dca4cae9a4bdACS", "device_specification": "Intel(R) Core(TM) i5-4278U CPU @ 2.60GHz", "form_factor": "iOS Laptop", "hdd_size_gb": 0, "last_logon_timestamp0": 1549341952, "last_logon_user": "", "manufacturer": "Apple", "model": "Macmini7,1", "operating_system": "MacOS", "os_service_pack": 101204, "resourceid": "59BC2313-C5B8-5504-BA58-6705C91C2340", "serialnumber": "C07T815EG1J1", "site_name": "Panania PS", "sitecode": "1809", "warranty": "2020-02-20"}
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} model - model filter 
        * @should - be ignored
        **/
        it.skip('GET /api/v2/model-count/:sitecode?model={model} Should ignore filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {
                        
                    }

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data.hits.hits[0]._source).toEqual(expected);
                });
        });
        


        it.skip('GET /api/v2/model-count/:sitecode?model={no model} Should ignore by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809?model=No Model found')
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
    describe('/api/v2/model-count/chart (e2e)', () => {

        /**
        * @param  {number} siteCode - school ID
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"name": "ThinkCentre M58", "y": 35}

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data[0]).toEqual(expected);
                });
        });





        /**
        * @param  {number} formFactor - form factor
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode/chart', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?formfactor=Desktop')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = {"name": "ThinkCentre M58", "y": 35};

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data[0]).toEqual(expected);
                });
        });






        /**
        * @param  {number} siteCode - school ID
        * @param  {string} warranty - warranty filter
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode/chart Respects filter by Warranty Period (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?warranty=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {


                    const expected = [{"name": "ThinkCentre M58", "y": 35}, {"name": "ThinkCentre M91p", "y": 21}, {"name": "ThinkCentre M73", "y": 10}, {"name": "Veriton S6630G", "y": 9}, {"name": "ThinkCentre M92p", "y": 8}, {"name": "ThinkPad T440", "y": 6}, {"name": "ThinkCentre M90p", "y": 5}, {"name": "TravelMate B115-M", "y": 5}, {"name": "ThinkPad T530", "y": 4}, {"name": "ThinkCentre M81", "y": 2}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });




        


        


        /**
        * @param  {number} siteCode - school ID
        * @param  {string} age - age of device filter 
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode/chart Respects filter by Device Age (GET)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?age=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "ThinkCentre M58", "y": 35}, {"name": "HP EliteDesk 800 G4 SFF", "y": 25}, {"name": "HP EliteDesk 800 G1 SFF", "y": 23}, {"name": "ThinkCentre M91p", "y": 21}, {"name": "HP EliteDesk 800 G2 SFF", "y": 17}, {"name": "ThinkPad T440", "y": 16}, {"name": "ThinkCentre M73", "y": 10}, {"name": "Veriton S6630G", "y": 9}, {"name": "ThinkCentre M92p", "y": 8}, {"name": "HP EliteBook 840 G1", "y": 7}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                    
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} utilisation - utilisation of device filter 
        * @todo - validate these are the expected values
        **/
        it('GET /api/v2/model-count/:sitecode/chart Respects filter by Utilisation ', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?utilisation=1y')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [{"name": "Macmini7,1", "y": 1}]
                      
                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });





        /**
        * @param  {number} siteCode - school ID
        * @param  {string} model - model filter 
        * @should ignore 
        **/
        it.skip('GET /api/v2/model-count/:sitecode?model={model} Respects filter by Model (HP EliteDesk 800 G1 SFF)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?model=HP EliteDesk 800 G1 SFF')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect((res) => {

                    const expected = [
                        
                    ]

                    expect(res.body.success).toEqual(true);
                    expect(res.body.data).toEqual(expected);
                });
        });


        it.skip('GET /api/v2/model-count/:sitecode/chart?model={no model} Respects filter by Model (No Model found)', () => {
            return request(app.getHttpServer())
                .get('/api/v2/model-count/1809/chart?model=No Model found')
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
