import {Logger, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectConfig} from 'nestjs-config';

/**
 * Passport SAML
 */
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, SAML} from 'passport-saml';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';
import {SAMLProfile} from '../interfaces/saml-profile.interface';

/**
 * Auth Service
 */
import {AuthService} from '../service/auth.service';

/**
 *
 * @class SamlStrategy - extends PassportStrategy
 *
 */
@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {

    private _saml: SAML;

    /**
    * @constructor 
    * @param {ConfigService} config 
    * @param {AuthService} authService - 
    **/
    constructor(
        @InjectConfig() private readonly config, 
        private readonly authService: AuthService
    ){
        super({
            path: config.get('saml').path,
            callbackUrl: config.get('saml').callbackUrl,
            entryPoint: config.get('saml').entryPoint,
            issuer: config.get('saml').issuer,
            cert: config.get('saml').cert,
            failureRedirect: '/auth/failure',
        });
    }

    /**
    * @method validate
    * @param {SAMLProfile} profile - SAML Profile 
    **/
    async validate(profile: SAMLProfile) {

        Logger.log('SamlStrategy.validate:profile');
        Logger.debug(' * profile -->', JSON.stringify(profile));

        const user = await this.authService.validateSAMLProfile(profile);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

    public generateServiceProviderMetadata(decryptionCert?: string, signingCert?: string) {

        Logger.log('SamlStrategy.generateServiceProviderMetadata');
        console.log(' * decryptionCert -->', decryptionCert)
        console.log(' * signingCert -->', signingCert);

        return this._saml.generateServiceProviderMetadata(decryptionCert, signingCert);
    }
}
