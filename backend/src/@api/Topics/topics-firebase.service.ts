import {Inject, Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
// import {CreateImageDto} from './dto/create-image.dto';
import {Topics} from './interfaces/topics.interface';
import {TOPICS_COLLECTION_PROVIDER} from './topics.constants';
import {CreateTopicDto} from './dto/create-topic.dto';
import {WriteResult} from '@google-cloud/firestore';

@Injectable()
export class TopicsFirebaseService {

    constructor(
        @Inject(TOPICS_COLLECTION_PROVIDER)
        private readonly topicsCollection: admin.firestore.CollectionReference,
    ) {
    }

    create(data: CreateTopicDto): Promise<Topics | WriteResult> {
        // Firebase
        return this.topicsCollection.doc(`${data.uid}`).set(data);
    }

    findAll(): Promise<Topics[] | any> {
        return new Promise((resolve, reject) => {
            this.topicsCollection.get().then(querySnapshot => {
                const promises: any = [];
                if (querySnapshot.empty) {
                    console.log('No matching documents.');
                    reject(promises);
                }
                querySnapshot.forEach((doc: any) => {
                    promises.push({
                        id: doc.id,
                        data: doc.data() as Topics,
                    });
                });
                // console.log(promises);
                resolve(promises);
            });
        });
    }

    find(uid: string): Promise<Topics | any> {
        return new Promise((resolve, reject) => {
            return this.topicsCollection
                .doc(`${uid}`)
                .get()
                .then(querySnapshot => {
                    const promises: any = [];
                    if (!querySnapshot.exists) {
                        console.log('No matching document.');
                        reject(promises);
                    }
                    promises.push({
                        id: querySnapshot.id,
                        data: querySnapshot.data() as Topics,
                    });
                    // console.log(promises);
                    resolve(promises[0]);
                });
        });
    }

}
