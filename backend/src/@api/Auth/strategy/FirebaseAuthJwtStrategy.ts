import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ExtractJwt, Strategy} from 'passport-firebase-jwt';
import {auth} from 'firebase-admin';

@Injectable()
export class FirebaseAuthJwtStrategy extends PassportStrategy(Strategy, 'passport-firebase') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: ExtractJwt.fromBodyField('token'),
            ignoreExpiration: false,
            // secretOrKey: jwtConstants.secret,
        });
    }

    validate(token) {
        return auth()
            .verifyIdToken(token, true)
            .catch((err) => {
                console.log(err);
                throw new UnauthorizedException();
            });
    }
}
