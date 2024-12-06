import {Injectable} from '@nestjs/common';
import {ImagesFirebaseService} from './images-firebase.service';
import {ImagesMongodbService} from './images-mongodb.service';
import {JimpImageHelper} from '@core/classes/JimpImageHelper';

@Injectable()
export class ImagesService {

    constructor(
        public firebase: ImagesFirebaseService,
        public mongodb: ImagesMongodbService,
    ) {

    }

    async transformMiniatureAsBuffer(file: any): Promise<Buffer> {
        // Build Miniature
        const imageHelper = new JimpImageHelper(file.buffer);
        const image = await imageHelper.applyMask4();
        const mime = image.getMIME();
        const maskedMiniatureBuffer = await image.quality(70).getBufferAsync(mime);

        return maskedMiniatureBuffer;
    }

}
