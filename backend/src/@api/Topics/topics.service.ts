import {Injectable} from '@nestjs/common';
import {TopicsFirebaseService} from "@api/Topics/topics-firebase.service";
import {TopicsMongodbService} from "@api/Topics/topics-mongodb.service";

@Injectable()
export class TopicsService {

    constructor(
        public firebase: TopicsFirebaseService,
        public mongodb: TopicsMongodbService,
    ) {
    }
}
