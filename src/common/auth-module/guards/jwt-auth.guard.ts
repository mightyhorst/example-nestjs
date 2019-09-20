import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';

/**
* @requires AuthGuard - protect routes with JWT strategy  
**/
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {


    /**
    * @method canActivate - boolean for whether can access this route or not 
    * @param context { ExecutionContext } - execution context to use in logic
    * @returns canActivate {boolean} - true/false can activate route or not 
    **/
    canActivate(context: ExecutionContext) {
        /**
            @todo - add your custom authentication logic here
            for example, call super.logIn(request) to establish a session.
        **/
        return super.canActivate(context);
    }

    /**
    * @method handRequest - throw 401 or return the user 
    * @param err { Error } - error 
    * @param user { User } - user returned from the service
    * @returns user {User} - User logged in or 
    * @returns UnauthorizedException {UnauthorizedException} - 401 not authroirsed exception 
    **/
    handleRequest(err, user, info) {
        if (err || !user) {
          throw err || new UnauthorizedException();
        }
        return user;
    }
}
