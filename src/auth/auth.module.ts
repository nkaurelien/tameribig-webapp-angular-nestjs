import { Module } from '@nestjs/common';
import { SuperTokensModule } from 'supertokens-nestjs';
import { SuperTokensConfig } from './supertokens.config';

@Module({
  imports: [SuperTokensModule.forRoot(SuperTokensConfig)],
  exports: [SuperTokensModule],
})
export class AuthModule {}
