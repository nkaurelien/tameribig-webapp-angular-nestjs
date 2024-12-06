import {MongooseModule} from "@nestjs/mongoose";
import {NOTIFICATION_MODEL_PROVIDER} from "./constants";
import {NotificationsSchema} from "./notifications.schema";

export const NotificationsModel = MongooseModule.forFeature([
    {name: NOTIFICATION_MODEL_PROVIDER, schema: NotificationsSchema},
]);
