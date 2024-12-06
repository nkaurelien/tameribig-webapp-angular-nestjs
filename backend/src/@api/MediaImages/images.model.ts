import {MongooseModule} from '@nestjs/mongoose';
import {IMAGE_COLLECTION_INDEX} from './images.constants';
import {ImageSchema} from './images.schema';

export const ImageModel = MongooseModule.forFeature([
    {name: IMAGE_COLLECTION_INDEX, schema: ImageSchema},
]);
