import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {InjectModel} from '@nestjs/mongoose';
import {
    NOTIFICATION_COLLECTION_INDEX,
    NOTIFICATION_MODEL_PROVIDER,
    ONESIGNAL_APP_ID,
    ONESIGNAL_REST_API_KEY,
} from './constants';
import {Notifications} from './interfaces/notifications.interface';
import {CreateNotificationDto} from './dto/create-notification.dto';
import OneSignal from 'onesignal-node';
import {CreateNotificationBody} from 'onesignal-node/lib/types';

// import {CreateCustomerDto} from './dto/create-Customer.dto';

@Injectable()
export class NotificationsService {
    private db: admin.firestore.Firestore;
    private notificationCollection: admin.firestore.CollectionReference;

    constructor(
        @InjectModel(NOTIFICATION_MODEL_PROVIDER)
        private readonly notificationModel: Model<Notifications>,
    ) {
        this.db = admin.firestore();
        this.notificationCollection = this.db.collection(NOTIFICATION_COLLECTION_INDEX);
    }

    async create(data: CreateNotificationDto): Promise<any> {
        const uuidv1 = require('uuid/v1');
        data.uid = uuidv1();
        // Firebase
        this.notificationCollection.doc(`${data.uid}`).set(data);

        // Mongo DB
        const item = new this.notificationModel(data);
        return await item.save();
    }

    find(criterias: Partial<Notifications>): Promise<any> {

        const query = this.notificationModel.find();
        query.where(criterias);
        query.limit(1000);
        return query.lean().exec();

    }

    async findAll(): Promise<any> {
        return await this.notificationModel.find().exec();
    }

    async findById(ID: string): Promise<any> {
        return await this.notificationModel.findById(ID).lean().exec();
    }

    async findByIdAndDelete(ID: string): Promise<any> {
        return await this.notificationModel.findByIdAndDelete(ID).lean().exec();
    }

    async findByIdAndMarkReaded(ID: string): Promise<any> {
        return await this.notificationModel.findByIdAndUpdate(ID, {
            readAt: (new Date()).toLocaleString(),
        }).lean().exec();
    }

    async remove(criterias: { uid: string }): Promise<any> {
        return await this.notificationModel.remove(criterias).lean().exec();
    }

    async update(
        criterias: Partial<Notifications>,
        datas: Partial<CreateNotificationDto>,
    ): Promise<any> {
        const query: any = {...criterias};
        return await this.notificationModel.update(query, datas, {
            multi: true,
        }).lean().exec();
    }

    ///  ONE SIGNAL

    oneSignalClient(): OneSignal.Client {
        const client = new OneSignal.Client(ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY);
        return client;
    }

    async createNotification(notification: CreateNotificationBody) {

        // using async/await
        try {
            const response = await this.oneSignalClient().createNotification(notification);
            // console.log(response.body.id);
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                // console.log(e.statusCode);
                // console.log(e.body);
            }
        }
    }

    async sendPushNotificationToEmails(emailList: string[], notification: Partial<CreateNotificationBody>) {

        // emailList = Array.isArray(emailList) ? emailList : [emailList];

        (emailList || []).map(email => createOnesignalPushNotification(email, notification)).forEach(async notif => {
            try {
                const response = await this.oneSignalClient().createNotification(notif);
                // console.log(response.body.id);
            } catch (e) {
                if (e instanceof OneSignal.HTTPError) {
                    // console.log(e.statusCode);
                    // console.log(e.body);
                }
            }
        });
    }

    async cancelNotification(notificationId: string) {

        try {
            const response = await this.oneSignalClient().cancelNotification(notificationId);
            // console.log(response.body);
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // console.log(e.statusCode);
                // console.log(e.body);
            }
        }
    }
}

function createOnesignalPushNotification(email: string, notification: CreateNotificationBody): CreateNotificationBody {

    notification.included_segments = ['Subscribed Users'/*, "Active Users", "Inactive Users"*/];
    notification.filters = [
        ...notification.filters,
        {
            field: 'email', value: email,
        },
    ];

    return notification;
}
