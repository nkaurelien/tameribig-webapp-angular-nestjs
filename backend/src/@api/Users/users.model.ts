import {MongooseModule} from "@nestjs/mongoose";
import {USER_MODEL_PROVIDER} from "@api/Users/constants";
import {UserSchema} from "@api/Users/users.schema";

export const UsersModel = MongooseModule.forFeature([
    {name: USER_MODEL_PROVIDER, schema: UserSchema},
]);
