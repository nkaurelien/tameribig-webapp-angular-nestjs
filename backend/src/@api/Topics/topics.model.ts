import {MongooseModule} from '@nestjs/mongoose';
import {TOPICS_COLLECTION_INDEX} from './topics.constants';
import {TopicSchema} from './topics.schema';

export const TopicModel = MongooseModule.forFeature([
    {name: TOPICS_COLLECTION_INDEX, schema: TopicSchema},
]);
