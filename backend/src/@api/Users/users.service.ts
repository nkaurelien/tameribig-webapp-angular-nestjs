import {Model} from 'mongoose';
import {Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {InjectModel} from '@nestjs/mongoose';
import {WriteResult} from '@google-cloud/firestore';
import {USER_COLLECTION_INDEX, USER_MODEL_PROVIDER} from '@api/Users/constants';
import {CreateCustomerDto} from '@api/Users/dto/create-customer.dto';
import {Customer} from '@api/Users/interfaces/customers.interface';
import {CreatePartnerDto} from '@api/Users/dto/create-partner.dto';

// import {CreateCustomerDto} from './dto/create-Customer.dto';

@Injectable()
export class UsersService {
    private db: admin.firestore.Firestore;
    private customersCollection: admin.firestore.CollectionReference;

    constructor(
        @InjectModel(USER_MODEL_PROVIDER)
        private readonly CustomerModel: Model<Customer>,
    ) {
        this.db = admin.firestore();
        this.customersCollection = this.db.collection(USER_COLLECTION_INDEX);
    }

    async create(data: CreateCustomerDto): Promise<Customer | WriteResult> {
        // Firebase
        this.customersCollection.doc(`${data.uid}`).set(data);

        // Mongo DB
        const item = new this.CustomerModel(data);
        return await item.save();
    }

    findCustomers(): Promise<Customer[] | any> {
        return new Promise((resolve, reject) => {
            this.customersCollection.get().then(querySnapshot => {
                const promises: any = [];
                if (querySnapshot.empty) {
                    // console.log('No matching documents.');
                    reject(promises);
                }
                querySnapshot.forEach((doc: any) => {
                    promises.push({
                        id: doc.id,
                        data: doc.data() as Customer,
                    });
                });
                // console.log(promises);
                resolve(promises);
            });
        });
    }

    findOne(uid: string): Promise<Customer | any> {
        return new Promise((resolve, reject) => {
            return this.customersCollection
                .doc(`${uid}`)
                .get()
                .then(querySnapshot => {
                    const promises: any = [];
                    if (!querySnapshot.exists) {
                        // console.log('No matching document.');
                        reject(promises);
                    }
                    promises.push({
                        id: querySnapshot.id,
                        data: querySnapshot.data() as Customer,
                    });
                    // console.log(promises);
                    resolve(promises[0]);
                });
        });
    }

    async findAll(): Promise<Customer[]> {
        return await this.CustomerModel.find().exec();
    }

    async remove(criterias: { uid: string }): Promise<any> {
        return await this.CustomerModel.remove(criterias).lean().exec();
    }

    findByNameOrID(param: string): Promise<any> {

        const criterias = {
            $or: [
                {uid: param},
                {username: param},
            ],
        };
        const query = this.CustomerModel.findOne(criterias);
        return query.lean().exec();

    }

    async update(
        criterias: Partial<Customer>,
        datas: Partial<CreatePartnerDto>,
    ): Promise<Customer[]> {
        const query: any = {...criterias};
        return await this.CustomerModel.update(query, datas, {
            multi: true,
        }).exec();
    }

    async updateOneOrCreate(
        criterias: Partial<Customer>,
        datas: Partial<CreatePartnerDto>,
    ): Promise<Customer[]> {
        const query: any = {...criterias};
        return await this.CustomerModel.updateOne(query, datas, {
            multi: false,
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }).exec();
    }

}
