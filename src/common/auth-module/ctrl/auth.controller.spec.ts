import { Mock } from 'ts-mockery';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { Request, Response, NextFunction } from "express";
import { Profile } from "@auth/interfaces/profile.interface";
import * as path from 'path';

import {JwtService} from '@nestjs/jwt';
import {SamlStrategy} from "@auth/strategy/saml.strategy";

const SAML_XML = `
<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="https://localhost/sp" ID="https___localhost_sp">
    <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
        <NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>
        <AssertionConsumerService index="1" isDefault="true" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="http://localhost/auth/saml/callback"/>
    </SPSSODescriptor>
</EntityDescriptor>
`
const TOKEN = 'TOKEN';


describe('Auth Controller', () => {
    let controller: AuthController;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            imports: [
                ConfigModule
            ],

            providers: [
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: function(config){
                            return TOKEN;
                        }
                    }
                },
                {
                    provide: SamlStrategy,
                    useValue: {
                        generateServiceProviderMetadata: function(cert){
                            return SAML_XML;
                        }
                    }
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: function(txt){
                            return "MIIFVjCCBD6gAwIBAgIMbIDnh0h8mqIA6VoQMA0GCSqGSIb3DQEBCwUAMGYxCzAJBgNVBAYTAkJF MRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMTwwOgYDVQQDEzNHbG9iYWxTaWduIE9yZ2FuaXph dGlvbiBWYWxpZGF0aW9uIENBIC0gU0hBMjU2IC0gRzIwHhcNMTYxMjA1MDUwMTA0WhcNMTkxMjA2 MDUwMTA0WjB6MQswCQYDVQQGEwJBVTEMMAoGA1UECBMDTlNXMQ8wDQYDVQQHEwZTeWRuZXkxJDAi BgNVBAoTG05TVyBEZXBhcnRtZW50IG9mIEVkdWNhdGlvbjEmMCQGA1UEAxMdc2FtbHNpZ25lci5k ZXYuZGV0Lm5zdy5lZHUuYXUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCzlMpBbK8f Yl+/jqyTS2KgWI07Oehy5qiHlU8+9OAVHTdDfu7esa2qyyyEBy8ztgTBk8xeVAoV6pQ8qEXAwo9X wh/tP9g84ZF72QBcAlRmow+Irq08qDOx+5yhRZw3l6W3+CDQ/sj2Lh+6EaCuPT3aQvEC+L1kyA8p /XGBpNlqg6nAHj2M3rMGNDt37Tb3tfuYMTG+2XViToxyBcOZmy1ejYgtyq9HuQo7SWyQbDTDdWsU E1FdSykF39qi7FR+WJqjGgSdy9btMqLrfVpODJTdLAwgyeJtgiKT2SBl2Y9z393ZlkGehe/vXeXY Ak2e3uf8CFcE9OT0V6w0w0fdft7nAgMBAAGjggHuMIIB6jAOBgNVHQ8BAf8EBAMCBaAwgaAGCCsG AQUFBwEBBIGTMIGQME0GCCsGAQUFBzAChkFodHRwOi8vc2VjdXJlLmdsb2JhbHNpZ24uY29tL2Nh Y2VydC9nc29yZ2FuaXphdGlvbnZhbHNoYTJnMnIxLmNydDA/BggrBgEFBQcwAYYzaHR0cDovL29j c3AyLmdsb2JhbHNpZ24uY29tL2dzb3JnYW5pemF0aW9udmFsc2hhMmcyMFYGA1UdIARPME0wQQYJ KwYBBAGgMgEUMDQwMgYIKwYBBQUHAgEWJmh0dHBzOi8vd3d3Lmdsb2JhbHNpZ24uY29tL3JlcG9z aXRvcnkvMAgGBmeBDAECAjAJBgNVHRMEAjAAMEkGA1UdHwRCMEAwPqA8oDqGOGh0dHA6Ly9jcmwu Z2xvYmFsc2lnbi5jb20vZ3MvZ3Nvcmdhbml6YXRpb252YWxzaGEyZzIuY3JsMCgGA1UdEQQhMB+C HXNhbWxzaWduZXIuZGV2LmRldC5uc3cuZWR1LmF1MB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEF BQcDAjAdBgNVHQ4EFgQUNFGqYB5y3TKqrEuEYQ4r9RSPEN8wHwYDVR0jBBgwFoAUlt5h8b0cFilT HMDMfTuDAEDmGnwwDQYJKoZIhvcNAQELBQADggEBAE5/A8fwFgiob1e6/qXR++nTffWm1+uXNFse eyP+xJLjI75PlPorHRZyeTKXY2F/BXykR51nLCJC3Ymlzi5DXuQ2i77LrSLUxG/kZZz+2h6jz4K7 nN6L7LFleDT7bHvorL7Kn26DodiYk4tJWZtkkoKlE1Bkt2QmYhpfWULwUsOAPebF1SW7DH0T6jiY VfyH4sNJ+PVHZM4zTY4aARET/i61wAWxDp7+SAzwDTe4WIbwMGrpw2ik87VIWXJl+EjGmoamGl/A a4Ziz7TCRfN1w42Gdc7MXviBGo07YJ4eH1Yq0ZSFEgdVFn0CgXLj7+Scp6MdD4blCy5ZevBjefE3 7zA="
                        }
                    }
                }
            ]
        }).compile();

        controller = module.get<AuthController>(AuthController);
        
    });

    it('should be defined', async () => {
        expect(controller).toBeDefined();
    });

    it('#SamlStrategy should match xml', async ()=>{

        const xmlJs = require('xml-js');
        const mockXml = SAML_XML;
        const mockJson = xmlJs.xml2json(mockXml, {compact: true, spaces: 4});

        const mdXml = controller.samlStrategy.generateServiceProviderMetadata('');
        const mdJson = xmlJs.xml2json(mdXml, {compact: true, spaces: 4});


        expect(mdXml).toEqual(mockXml);
        expect(mdJson).toEqual(mockJson);
    })

    it('#JwtService should match xml', async ()=>{

        const token = await controller.jwtService.signAsync({});
        expect(token).toEqual(TOKEN);

    })

    it('#samlMetadata should ', async () => {

        // expect( controller.samlMetadata() ).toEqual( 'TODO' );

    })

    it('#samlCallback should ', async () => {

        var request = {}
        let req = Mock.of<Request>(request);
        req['user'] = {
            'email': 'req.user.email',
            'extensionAttribute2': 'req.user.extensionAttribute2',
            'sn': 'req.user.sn',
            'mailNickname': 'req.user.mailNickname',
            'detAttribute12': 'req.user.detAttribute12',
            'givenName': 'req.user.givenName',
            'groups': 'req.user.groups',
        }
        
        let res = Mock.of<Response>({
           json: jest.fn().mockReturnValue({ token: TOKEN }),
           send: jest.fn().mockReturnValue('JWT '+TOKEN),
           redirect: jest.fn().mockReturnValue(''),
        });

        let next = { next: jest.fn().mockReturnValue('') };

        let user:Profile = <Profile>req['user'];

        let spyCtrl = jest.spyOn(controller, 'samlCallback');
        let spyRes = jest.spyOn(res, 'redirect');
        let spyNext = jest.spyOn(next, 'next');

        controller.samlCallback(req, res, next.next )

        expect(spyCtrl).toHaveBeenCalled();
        

    })

    it('#samlBackdoor should return token as redirect', async ()=>{

        let req = Mock.of<Request>({});
        let res = Mock.of<Response>({
           json: jest.fn().mockReturnValue({ token: TOKEN }),
           send: jest.fn().mockReturnValue('JWT '+TOKEN),
           redirect: jest.fn().mockReturnValue(''),
        });

        let next = { next: jest.fn().mockReturnValue('') };

        let spyCtrl = jest.spyOn(controller, 'samlBackdoor');
        controller.samlBackdoor(req, res, next.next );

        expect(spyCtrl).toHaveBeenCalled();

    })


    it('#samlBackdoor should return token as json', async ()=>{

        let req = Mock.of<Request>({});
        let res = Mock.of<Response>({
           json: jest.fn().mockReturnValue({ token: TOKEN }),
           send: jest.fn().mockReturnValue('JWT '+TOKEN),
           redirect: jest.fn().mockReturnValue(''),
        });

        let next = { next: jest.fn().mockReturnValue('') };

        let spyCtrl = jest.spyOn(controller, 'samlBackdoor');
        controller.samlBackdoor(req, res, next.next, true, false );

        expect(spyCtrl).toHaveBeenCalled();

    })

    it('#samlBackdoor should return token as text', async ()=>{

        let req = Mock.of<Request>({});
        let res = Mock.of<Response>({
           json: jest.fn().mockReturnValue({ token: TOKEN }),
           send: jest.fn().mockReturnValue('JWT '+TOKEN),
           redirect: jest.fn().mockReturnValue(''),
        });

        let next = { next: jest.fn().mockReturnValue('') };

        let spyCtrl = jest.spyOn(controller, 'samlBackdoor');
        controller.samlBackdoor(req, res, next.next, false, true )

        expect(spyCtrl).toHaveBeenCalled();
        
    })

    it('#samlBackdoor should be deactivated for production', async ()=>{

        const nodeEnv:string = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        let req = Mock.of<Request>({});
        let res = Mock.of<Response>({
           json: jest.fn().mockReturnValue({ token: TOKEN }),
           send: jest.fn().mockReturnValue('JWT '+TOKEN),
           redirect: jest.fn().mockReturnValue(''),
        });

        let next = { next: jest.fn().mockReturnValue('') };

        let spyCtrl = jest.spyOn(controller, 'samlBackdoor');
        var response = await controller.samlBackdoor(req, res, next.next, false, true )

        expect(spyCtrl).toHaveBeenCalled();
        expect(response).toEqual('deactivated in production');

        process.env.NODE_ENV = nodeEnv || 'test';

        response = await controller.samlBackdoor(req, res, next.next, false, true )
        expect(response).not.toEqual('deactivated in production');
    });

});
