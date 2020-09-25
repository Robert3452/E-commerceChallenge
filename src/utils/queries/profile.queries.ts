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
            const userUpadted = await User.updateOne({ _id: id }, { $set: json  });
            // console.log(userUpadted)
            return userUpadted;
        } catch (error) {
            return error;
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