import {Model} from 'mongoose';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import {InjectModel} from '@nestjs/mongoose';
import {WriteResult} from '@google-cloud/firestore';
import {USER_COLLECTION_INDEX, USER_MODEL_PROVIDER} from '@api/Users/constants';
import {CreateCustomerDto} from '@api/Users/dto/create-customer.dto';
import {Customer} from '@api/Users/interfaces/customers.interface';
import {CreatePartnerDto} from '@api/Users/dto/create-partner.dto';
import {UsersService} from '@api/Users/users.service';
import {FireUserHelpers} from '@api/Auth/index';

// import {CreateCustomerDto} from './dto/create-Customer.dto';

@Injectable()
export class AuthUserService {
    private db: admin.firestore.Firestore;
    private customersCollection: admin.firestore.CollectionReference;

    constructor(
        private readonly jwtService: JwtService,
        public readonly usersService: UsersService,
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

    findByNameOrID(param: string): Promise<Customer[] | any> {

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
    ): Promise<Customer[] | any> {
        const query: any = {...criterias};
        return await this.CustomerModel.update(query, datas, {
            multi: true,
        }).lean().exec();
    }

    async validateUser(idToken: string): Promise<any> {
        try {
            const checkRevoked = false;
            const decodedToken = await FireUserHelpers.verifyIdToken(
                idToken,
                checkRevoked,
            );
            const uid = decodedToken.uid;
            const userRecord = FireUserHelpers.getUser(uid);

            return userRecord;

        } catch (error) {
            if (error.code === 'auth/id-token-revoked') {
                // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
            } else {
                // Token is invalid.
            }

            throw new UnauthorizedException();
        }

    }

    /**
     * return the access jwt generate with passport jwt
     * @param user Firebase user record
     */
    async login(user: any) {
        const payload = {userRecord: user, username: user.username, sub: user.uid};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
