import Scope, { IScope } from '../../models/Scope';
import Crud from './queries';

class ScopeCrud implements Crud<IScope>{
    async store(json: object): Promise<IScope> {
        throw new Error('Method not implemented.');
    }
    update(id: string, json: object): Promise<IScope | null> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<Object | IScope | null> {
        throw new Error('Method not implemented.');
    }
    async getAll(): Promise<IScope[]> {
        throw new Error('Method not implemented.');
    }
    async findOneById(id: string): Promise<IScope | null> {
        throw new Error('Method not implemented.');
    }
    async findByToken(token: string): Promise<IScope | null> {
        try {
            const apiKey = await Scope.findOne({ token });
            return apiKey
        } catch (error) {
            throw error
        }
    }

}

export default ScopeCrud;