import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';
import { UsersModule } from '../users/index.js';
import { UsersService } from '../users/users.service.js';
import { SuperTokensBaseConfig } from './supertokens.config.js';

@Module({
  imports: [
    UsersModule,
    SuperTokensModule.forRootAsync({
      imports: [UsersModule],
      inject: [UsersService],
      useFactory: (usersService: UsersService) => ({
        ...SuperTokensBaseConfig,
        recipeList: [
          EmailPassword.init({
            signUpFeature: {
              formFields: [{ id: 'fullname' }],
            },
            emailDelivery: {
              override: (originalImplementation) => ({
                ...originalImplementation,
                sendEmail: async (input) => {
                  if (input.type === 'PASSWORD_RESET') {
                    return originalImplementation.sendEmail({
                      ...input,
                      passwordResetLink: input.passwordResetLink.replace(
                        '/reset-password',
                        '/auth/reset-password',
                      ),
                    });
                  }
                  return originalImplementation.sendEmail(input);
                },
              }),
            },
            override: {
              apis: (originalImplementation) => ({
                ...originalImplementation,
                signUpPOST: async (input) => {
                  if (!originalImplementation.signUpPOST) {
                    throw new Error('signUpPOST not defined');
                  }

                  const response =
                    await originalImplementation.signUpPOST(input);

                  if (response.status === 'OK') {
                    const fullname = input.formFields.find(
                      (f) => f.id === 'fullname',
                    )?.value as string | undefined;
                    await usersService.findOrCreateBySupertokensId(
                      response.user.id,
                      response.user.emails[0],
                      fullname,
                    );
                  }

                  return response;
                },
              }),
            },
          }),
          Session.init(),
          Dashboard.init(),
          UserRoles.init(),
        ],
      }),
    }),
  ],
  exports: [SuperTokensModule],
})
export class AuthModule {}
