import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/index.js';
import { GeneratorService, PasswordService } from './services/index.js';

@Module({
  imports: [AppConfigModule],
  providers: [GeneratorService, PasswordService],
  exports: [AppConfigModule, GeneratorService, PasswordService],
})
export class CoreModule {}
