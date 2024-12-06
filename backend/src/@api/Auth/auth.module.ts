import {Module} from '@nestjs/common';
import {LoginController} from './LoginController';
import {RegisterController} from './RegisterController';
import {FirebaseAuthJwtStrategy} from './strategy/FirebaseAuthJwtStrategy';
import {FirebaseAuthLocalStrategy} from './strategy/FirebaseAuthLocalStrategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {AuthUserService} from './auth-user.service';
import {UsersModel} from '@api/Users/users.model';
import {jwtConstants} from './auth.constant';
import {UsersService} from '@api/Users/users.service';
import {UsersModule} from "@api/Users/users.module";
import {usersProviders} from "@api/Users/users.providers";
import {DatabaseModule} from "@databases/database.module";
import {NotificationsModule} from "@api/Notifications/notifications.module";
import {PasswordResetController} from "@api/Auth/PasswordResetController";

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'passport-firebase'}),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '30d'},
        }),
        UsersModel,
        UsersModule,
        DatabaseModule,
        NotificationsModule,
        PassportModule,
    ],
    controllers: [
        LoginController,
        RegisterController,
        PasswordResetController,
    ],
    exports: [PassportModule, JwtModule, AuthUserService, UsersService, FirebaseAuthJwtStrategy, FirebaseAuthLocalStrategy, ...usersProviders],
    providers: [AuthUserService, UsersService, FirebaseAuthJwtStrategy, FirebaseAuthLocalStrategy, ...usersProviders],
})
export class AuthModule {
    // static register(): DynamicModule {
    //   return {
    //     module: AuthModule,
    //     exports: [PassportModule, JwtModule, AuthUserService, UsersService, FirebaseAuthJwtStrategy, FirebaseAuthLocalStrategy, ...usersProviders],
    //     providers: [AuthUserService, UsersService, FirebaseAuthJwtStrategy, FirebaseAuthLocalStrategy, ...usersProviders],
    //   };
    // }
}
