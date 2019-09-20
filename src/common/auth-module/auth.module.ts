import {Module} from '@nestjs/common';

/**
 * @requires PassportModule {Module} - PassportJs authn/authz facade
 */
const passport = require('passport');
import {PassportModule} from '@nestjs/passport';
import {ConfigService} from "nestjs-config";

/**
 * @class AuthController {Controller} - endpoints for Authn/Authz
 * @class AuthService {Service} - implemenets the Passport strategy
 */
import {AuthController} from './ctrl/auth.controller';
import {AuthService} from './service/auth.service';

/**
 * JWT Strategy
 * @todo - replace with SAML
 */
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './strategy/jwt.strategy';

/**
 * SAML Strategy
 * @todo - replace with SAML
 */
import {SamlStrategy} from './strategy/saml.strategy';


@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'saml'}),
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secretOrPrivateKey: configService.get('jwt.secret'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, SamlStrategy, JwtStrategy],
    exports: [PassportModule, AuthService],
})
export class AuthModule {}
