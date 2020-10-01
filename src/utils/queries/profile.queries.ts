import { addressSchema, IAddress } from '../../models/Address';
import User, { IUser } from '../../models/User';
import CrudAttributes from './queries';

class ProfileCrud implements CrudAttributes<IUser>{
    async store(json: object): Promise<IUser> {
        try {
            const user = new User(json);
            await user.save();
            return user;
        } catch (error) {
            return error
        }
    }
    async update(id: string, json: object): Promise<IUser | null> {
        try {
            const userUpadted = await User.updateOne({ _id: id }, { $set: json });
            return userUpadted;
        } catch (error) {
            return error;
        }
    }
    async getAddresses(email: string): Promise<IAddress[] | Array<any>> {
        try {
            const user = await this.findByEmail(email);
            if (!user) throw 'user not found'
            const addresses = user.addresses || [];

            return addresses;

        } catch (error) {
            throw error
        }

    }

    async updateAddress(email: string, id: string, body: any): Promise<string> {
        try {

            const user = await this.findByEmail(email);
            if (!user) throw 'user not found';
            let current: number = 0;

            let address = user.addresses.find((el, index) => {
                if (el._id === id) {
                    current = index;
                    return el
                }
            });

            if (!address) throw 'not found'

            address = <IAddress>{ ...address, ...body };
            console.log(address)
            user.addresses[current] = address;
            await user.updateOne({});
            return address._id;
        } catch (error) {
            throw error
        }
    }
    async setAddress(id: string, json: any): Promise<string> {
        try {
            const user = await User
                .findOneAndUpdate({ _id: id }, { $push: { addresses: json } }, { new: true })
            if (!user) throw "User not found"
            const addressSelected = user.addresses.find(el => el.address === json.address)
            return addressSelected?._id

        } catch (error) {
            throw error
        }
    }
    async delete(id: string): Promise<Object | IUser | null> {
        try {
            const deletedUser = await User.deleteOne({ _id: id });
            return deletedUser

        } catch (error) {
            return error
        }
    }
    async getAll(): Promise<IUser[]> {
        try {
            const users = await User.find({});
            return users

        } catch (error) {
            return error
        }
    }
    async findOneById(id: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ _id: id });

            return user
        } catch (error) {
            return error
        }
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email });
            return user
        } catch (error) {
            return error
        }
    }

    async signinVerify(password: string, email: string): Promise<IUser | null> {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;
            const signedIn = await user.comparePasswords(password);
            if (!signedIn) return null
            return user
        } catch (error) {
            return error
        }
    }
}
export default ProfileCrud;