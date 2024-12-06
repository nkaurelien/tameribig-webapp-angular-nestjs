import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {Strategy} from 'passport-local';
import {AuthUserService} from '../auth-user.service';

@Injectable()
export class FirebaseAuthLocalStrategy extends PassportStrategy(Strategy, 'local-firebase') {

    constructor(private readonly authService: AuthUserService) {
        super({
            usernameField: 'email',
            passwordField: 'token',
        });
    }

    validate(usernameField: string, passwordField: string) {
        const token = passwordField;
        return this.authService.validateUser(token);
    }
}
