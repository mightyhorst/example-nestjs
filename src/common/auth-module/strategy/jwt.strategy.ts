import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly authService: AuthService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
          secretOrKey: 'secretKey',
        });
    }

    /**
    * @method validate 
    * @param {JwtPayload} payload 
    */
    async validate(payload: JwtPayload) {

        Logger.log('JwtStrategy.validate');
        console.log(' * payload -->', payload);

        const user = await this.authService.validateToken(payload);
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
    }
}
