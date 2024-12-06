import {Global, HttpModule, Module} from '@nestjs/common';
import {AwsS3Service} from './services/aws-s3.service';
// import {ConfigService} from './services/config.service';
import {GeneratorService} from './services/generator.service';
import {CloudinaryService} from './services/cloudinary.service';
// import {JwtModule} from '@nestjs/jwt';
// import {ValidatorService} from './services/validator.service';

const providers = [
    // ConfigService,
    // ValidatorService,
    AwsS3Service,
    GeneratorService,
    CloudinaryService,
];

@Global()
@Module({
    providers,
    imports: [
        HttpModule,
        // JwtModule.registerAsync({
        //     imports: [CoreModule],
        //     useFactory: (configService: ConfigService) => ({
        //         secretOrPrivateKey: configService.get('JWT_SECRET_KEY'),
        //         // if you want to use token with expiration date
        //         // signOptions: {
        //         //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        //         // },
        //     }),
        //     inject: [ConfigService],
        // }),
    ],
    exports: [...providers, HttpModule, /*JwtModule*/],
})
export class CoreModule {
}
