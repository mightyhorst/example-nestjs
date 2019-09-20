import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy} from "@auth/strategy/jwt.strategy";


describe.skip('JwtService', ()=> {
    let service: JwtService;
    let token: string;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }),
                JwtModule.register({
                    secretOrPrivateKey: 'secretKey',
                    signOptions: {
                        expiresIn: 3600,
                    },
                }),
            ],
        }).compile();

        service = module.get<JwtService>(JwtService);

        // Generate a token using a failed case
        token = await service.signAsync({
            email: "Gayle.Pinn@det.nsw.edu.au",
            extensionAttribute2: "2667",
            sn: "Pinn",
            // mailNickname: notavail,
            detAttribute12: "2667",
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
                'CN=Mulwala PS - 2667 SRT Contrib,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',

                // This puts the group size over the 8k header limit
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
                'CN=Mulwala PS - 2667 SRT Contrib,OU=Groups,OU=Mulwala PS,OU=Riverina,OU=Schools,DC=DETNSW,DC=WIN',
            ]
        }, {
            subject: "Gayle.Pinn@det.nsw.edu.au"
        });
    });

    // Possible theory for DUB-598 is that the users that fail to get a token, do so because their group membership generates
    // a JWT higher than the allowable HTTP header limit of 8kb when encoded.
    // Another possibility is redirecting to a URL with a token that exceeds max url size
    it('DUB-598: should generate a JWT token under 8kb using a user with a large number of group memberships', async () => {
        expect(token.length).toBeLessThanOrEqual(8000);
    });

    // DUB-598 Regression Test
    it('DUB-598: should generate a JWT token under 2000 characters using a user with a large number of group memberships', async () => {
        expect(token.length).toBeLessThanOrEqual(2000);
    });
});

