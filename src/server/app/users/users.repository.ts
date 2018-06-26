import { Response } from 'express';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createUser(res: Response, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.createUser, { uId, email, username, password, passwordSalt, emailCode });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        const result = await res.locals.neo4jSession.run(this.query.users.doesUsernameAndEmailExist, { email, username });

        const model = result.records.map(x => {
            const localModel = new DoesUsernameAndEmailExist();
            localModel.emailExist = x.get('emailExist');
            localModel.usernameExist = x.get('usernameExist');
            return localModel;
        });

        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getUser(res: Response, emailOrUsername: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.getUser, { emailOrUsername });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getUserById(res: Response, userId: number): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.getUserById, { userId });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async forgotPassword(res: Response, email: string, code: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.addForgottenPasswordCode, { email, code });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async changeForgottenPassword(res: Response, email: string, code: string, password: string, passwordSalt: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.changeForgottenPassword, { email, code, password, passwordSalt });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async verifyEmail(res: Response, userId: number, code: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(this.query.users.verifyEmail, { userId, code });

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return null;
        }
    }

    public async updateAvatar(res: Response, userId: number, avatarUrl: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.updateAvatar, { userId, avatarUrl });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updateBio(res: Response, userId: number, bio: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.updateBio, { userId, bio });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updatePassword(res: Response, userId: number, password: string, passwordSalt: string): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(this.query.users.updatePassword, { userId, password, passwordSalt });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async deleteUser(res: Response, userId: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(this.query.users.deleteUser, { userId });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async completedTutorial(res: Response, userId: number, viewModel: CompletedTutorial): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(this.query.users.completedTutorial, { userId, tutorialType: viewModel.tutorialType, didSkip: viewModel.didSkip });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
