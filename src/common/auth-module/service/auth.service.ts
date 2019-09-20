import {Injectable, Logger} from '@nestjs/common';
/**
 * @requires JwtStrategy service and interfaces
 **/
import {JwtService} from '@nestjs/jwt';
import {JwtPayload} from '../interfaces/jwt-payload.interface';
import {SAMLProfile} from '../interfaces/saml-profile.interface';
import {Profile} from '@auth/interfaces/profile.interface';
import {PrincipalGroups, Roles} from '@auth/constants';
import {InjectConfig} from "nestjs-config";

/**
 *
 * @class AuthService
 * Apply the Passport strategy and authn/authz users
 *
 */
@Injectable()
export class AuthService {

    /**
     * @constructor inject the Jwt Strategy Service
     * @param  jwtService {JwtService} - JwtStrategy validation service
     * @param  config {Object} - Configuration service
     */
    constructor(private readonly jwtService: JwtService, @InjectConfig() private readonly config) {}

    /**
     * @method Validate User - placeholder to validate the token
     * @todo update for SAML
     * @todo update interface to be user parsed
     */
    async validateSAMLProfile(payload: SAMLProfile): Promise<Profile> {

        Logger.log('AuthService.validateSAMLProfile');
        Logger.debug(payload);

        if (payload.nameIDFormat !== 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress') {
            throw new TypeError('Unsupported nameID format, you need to check your SAML IdP configuration');
        }

        // User doesn't belong to any groups.
        if (!payload.groups) { return null; }

        const groups = payload.groups;
        const validGroups = this.config.get('saml').groupWhitelist;

        if (!groups.some(grp => validGroups.indexOf(grp) !== -1)) {
            // Did not match any principal group
            return null;
        }

        const user: Profile = {
            email: payload.nameID,
            givenName: payload.givenName,
            sn: payload.sn,

            // DETPEPLocation - Primary Location
            extensionAttribute2: payload.extensionAttribute2,

            // casual employee locations
            detAttribute12: payload.detAttribute12,

            /**
            * @author Nick Mitchell
            * @todo check - added this in merge conflict, may need to be removed
            **/
            role: Roles.Principal,

        };
        return user;
    }

    async validateToken(payload: JwtPayload): Promise<Profile> {
        
        Logger.log('AuthService.validateToken');
        Logger.debug(payload);

        const user: Profile = {
            email: payload.sub,
            givenName: payload.givenName,
            sn: payload.sn,

            // DETPEPLocation - Primary Location
            extensionAttribute2: payload.extensionAttribute2,

            // casual employee locations
            detAttribute12: payload.detAttribute2,
        };

        return user;
    }

}
