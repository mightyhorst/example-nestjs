import {Controller, Logger, UseGuards, Get, Req, Res, Next, Render, Post, Header, UseFilters, Query} from '@nestjs/common';
import {Request, Response, NextFunction} from "express";
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from '@nestjs/jwt';
import {generateServiceProviderMetadata} from 'passport-saml';
import {SamlStrategy} from "@auth/strategy/saml.strategy";
import {InjectConfig} from 'nestjs-config';
import {Profile} from "@auth/interfaces/profile.interface";
import {SAMLUnauthorizedFilter} from "@common/filters/saml.unauthorized.filter";
import {Roles} from "@auth/constants";

const passport = require('passport');

@Controller('auth')
export class AuthController {

    constructor(
        readonly jwtService: JwtService,
        readonly samlStrategy: SamlStrategy,
        @InjectConfig() readonly config,
    ){ 
        
    }

    @Get('/saml/metadata')
    @Header('Content-Type', 'text/xml;charset=utf8')
    async samlMetadata() {

        Logger.log('GET /saml/metadata');
        Logger.debug(this.samlStrategy);

        console.dir(this.samlStrategy);
        const md = this.samlStrategy.generateServiceProviderMetadata(this.config.get('saml').cert);
        return md;
    }

    @Post('/saml/callback')
    @UseFilters(SAMLUnauthorizedFilter)
    @UseGuards(AuthGuard('saml'))
    async samlCallback(
        @Req() req: Request & { user?: Profile },
        @Res() res: Response,
        @Next() next: NextFunction) {

        Logger.log('POST /saml/callback');
        Logger.debug(req.user);

        // Generate a token
        const jwt = await this.jwtService.signAsync({
            email: req.user.email,
            extensionAttribute2: req.user.extensionAttribute2,
            sn: req.user.sn,
            detAttribute12: req.user.detAttribute12,
            givenName: req.user.givenName,
            role: Roles.Principal,
        }, {
            subject: req.user.email,
        });

        res.redirect("/#/token/" + jwt);
    }

    @Get('/saml/redirect')
    @UseGuards(AuthGuard('saml'))
    async redirect(): Promise<any> {

        Logger.log('GET /saml/redirect');

    }


    @Get('/saml/backdoor')
    async samlBackdoor(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Query('json') isJson?: boolean,
        @Query('text') isText?: boolean
    ) {
        
        if(process.env.NODE_ENV === 'production'){
            return Promise.resolve('deactivated in production');
        }

        Logger.log('GET /saml/backdoor');

        /** 
        * Generate a token
        **/
        const jwt = await this.jwtService.signAsync({
            email: "Andrew.Pryor@tst.det.nsw.edu.au",
            extensionAttribute2: "4268",
            sn: "Pryor",
            mailNickname: "andrew.pryor",
            detAttribute2: "4268",
            givenName: "Andrew",
            groups: [
                "CN=SCHOOL.TEACHER,OU=Groups,OU=Portal,OU=Services,DC=uatdetnsw,DC=win",
                "CN=Griffith East PS - School.Principal,OU=Groups,OU=Griffith East PS,OU=Riverina,OU=Schools,DC=uatdetnsw,DC=win",
                "CN=Griffith East PS - School.Teacher,OU=Groups,OU=Griffith East PS,OU=Riverina,OU=Schools,DC=uatdetnsw,DC=win",
                "CN=ADI-CAD-SAPBPC,OU=Groups,OU=GEN,OU=CAD,OU=ADI,OU=Services,DC=uatdetnsw,DC=win",
                "CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=uatdetnsw,DC=win"
            ]
        }, {
            subject: "Andrew.Pryor@tst.det.nsw.edu.au",
            expiresIn: "4 hours"
        });
        
        /**
        * @hack this is for e2e testing to avoid delaing with HTTP 302 redirects
        **/
        if(isJson){
            res.json({token: jwt});
        }else if(isText){
            res.send('JWT '+jwt);
        }else{
            res.redirect("/#/token/" + jwt);   
            // return next();
        }
        
    }

    // This should never make it to prod
    @Get('/saml/test/DUB-598')
    async samlRegression(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: any,
        @Query('json') isJson?: boolean,
        @Query('text') isText?: boolean
    ) {
        if(process.env.NODE_ENV === 'production'){
            return Promise.resolve('deactivated in production');
        }

        /**
         * Generate a token
         **/
        const jwt = await this.jwtService.signAsync({
            email: "Gayle.Pinn@det.nsw.edu.au",
            extensionAttribute2: "2667",
            sn: "Pinn",
            detAttribute2: "2667",
            givenName: "Gayle",
            groups: [ 'CN=Mulwala PS - SMU,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 EBS4AGENT,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.Principal,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - Software Management,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.Local1,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - AMU,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - OS Management,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - Software Management,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - DIP Management,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - Best Start,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - ERN Training,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - Premiers Read Challenge,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - RMU,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - RMU Training,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.Office,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=APP_BI_POWER_BI_PRO_USERS,OU=APP,OU=BI,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.Teacher,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Adelong PS - Best Start,OU=Groups,OU=Adelong PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School Oasis Systems,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 SRT Prin,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - ERN,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=SCHOOL.CASUALTEACHER,OU=Groups,OU=Portal,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 Stage 3 SIT,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - Premiers Sport Challenge,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=APP_BI_BI_TESTING_TEAM,OU=APP,OU=BI,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - School.TSO,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - OS Management,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Device_3556_Admin,OU=Admin Groups,OU=_Management,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - Access Student Folder,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - School Oasis Systems,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - AntiVirus Management,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - SMT,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=SAP-LMBR4-IE,OU=Groups,OU=Management,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - Best Start,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - Best Start For Training,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=2667 - PWS Author,OU=Location Based,OU=PWS,OU=Services,DC=DETNSW,DC=WIN',
                'CN=SCHOOL.TEACHER,OU=Groups,OU=Portal,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 EBS4CLIENT,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Adelong PS - School Oasis Systems,OU=Groups,OU=Adelong PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=APP_BI_PRINCIPAL,OU=APP,OU=BI,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - EMU,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - Best Start For Training,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Adelong PS - Best Start For Training,OU=Groups,OU=Adelong PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.SAP,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Yerong Creek PS - Annual School Reports,OU=Groups,OU=Yerong Creek PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - School.SLS.Admin,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Device_2667_Admin,OU=Admin Groups,OU=_Management,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=pwd_staff_91,OU=IDM,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 Synergy,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=LMBR_Group_4,OU=_Management,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 10470 ALAN Admin,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 SPARO.Principal,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=2667 - PWS Approver,OU=Location Based,OU=PWS,OU=Services,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - StemShare.Booking.User,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
                'CN=Mulwala PS - 2667 SRT Contrib,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN' ]
        }, {
            subject: "Gayle.Pinn@det.nsw.edu.au",
            expiresIn: "4 hours"
        });

        /**
         * @hack this is for e2e testing to avoid delaing with HTTP 302 redirects
         **/
        if(isJson){
            res.json({token: jwt});
        }else if(isText){
            res.send('JWT '+jwt);
        }else{
            res.redirect("/#/token/" + jwt);
            // return next();
        }
    }

}
