import { v1 as neo4j } from 'neo4j-driver';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { Database } from '../../core/database';
import { BaseRepository, Folder, Users } from '../shared/base-repository';

export class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createUser(session: neo4j.Session, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.CreateUser)}`);
        const result = await session.run(query.data, { uId, email, username, password, passwordSalt, emailCode });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async doesUsernameAndEmailExist(session: neo4j.Session, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.DoesUsernameAndEmailExist)}`);
        const result = await session.run(query.data, { email, username });

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

    public async getUser(session: neo4j.Session, emailOrUsername: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.GetUser)}`);
        const result = await session.run(query.data, { emailOrUsername });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async getUserById(session: neo4j.Session, userId: number): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.GetUserById)}`);
        const result = await session.run(query.data, { userId });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async forgotPassword(session: neo4j.Session, email: string, code: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.AddForgottenPasswordCode)}`);
        const result = await session.run(query.data, { email, code });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async changeForgottenPassword(session: neo4j.Session, email: string, code: string, password: string, passwordSalt: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.ChangeForgottenPassword)}`);
        const result = await session.run(query.data, { email, code, password, passwordSalt });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async verifyEmail(session: neo4j.Session, userId: number, code: string): Promise<boolean> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.VerifyEmail)}`);
        const result = await session.run(query.data, { userId, code });

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return null;
        }
    }

    public async updateAvatar(session: neo4j.Session, userId: number, avatarUrl: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.UpdateAvatar)}`);
        const result = await session.run(query.data, { userId, avatarUrl });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updateBio(session: neo4j.Session, userId: number, bio: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.UpdateBio)}`);
        const result = await session.run(query.data, { userId, bio });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async updatePassword(session: neo4j.Session, userId: number, password: string, passwordSalt: string): Promise<UserModel> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.UpdatePassword)}`);
        const result = await session.run(query.data, { userId, password, passwordSalt });

        const model = result.records.map(x => Database.createNodeObject(x.get('user'))) as UserModel[];
        if (model !== null && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    public async deleteUser(session: neo4j.Session, userId: number): Promise<boolean> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.DeleteUser)}`);
        const result = await session.run(query.data, { userId });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async completedTutorial(session: neo4j.Session, userId: number, viewModel: CompletedTutorial): Promise<boolean> {
        const query = await import(`../../database/queries/${this.getQueryPath(Folder.Users, Users.CompletedTutorial)}`);
        const result = await session.run(query.data, { userId, tutorialType: viewModel.tutorialType, didSkip: viewModel.didSkip });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
