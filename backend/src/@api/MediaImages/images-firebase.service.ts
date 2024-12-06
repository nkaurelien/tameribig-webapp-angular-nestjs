import {Inject, Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {Image} from './interfaces/images.interface';
import {IMAGE_COLLECTION_PROVIDER} from './images.constants';
import {CreateImageDto} from './dto/create-image.dto';
import {WriteResult} from '@google-cloud/firestore';

@Injectable()
export class ImagesFirebaseService {

    constructor(
        @Inject(IMAGE_COLLECTION_PROVIDER)
        private readonly imagesCollection: admin.firestore.CollectionReference,
    ) {
    }

    create(data: CreateImageDto): Promise<Image | WriteResult> {
        // Firebase
        return this.imagesCollection.doc(`${data.uid}`).set(data);
    }

    findAll(): Promise<Image[] | any> {
        return new Promise((resolve, reject) => {
            this.imagesCollection.get().then(querySnapshot => {
                const promises: any = [];
                if (querySnapshot.empty) {
                    console.log('No matching documents.');
                    reject(promises);
                }
                querySnapshot.forEach((doc: any) => {
                    promises.push({
                        id: doc.id,
                        data: doc.data() as Image,
                    });
                });
                // console.log(promises);
                resolve(promises);
            });
        });
    }

    find(uid: string): Promise<Image | any> {
        return new Promise((resolve, reject) => {
            return this.imagesCollection
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
                        data: querySnapshot.data() as Image,
                    });
                    // console.log(promises);
                    resolve(promises[0]);
                });
        });
    }

}
