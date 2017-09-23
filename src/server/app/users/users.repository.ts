import { v1 as neo4j } from 'neo4j-driver';
import { Database } from '../../core/database';
import { BaseRepository, Folder, Posts, Users } from '../shared/base-repository';
import { NewsletterMemberViewModel } from '../../view-models/newsletter/newsletter-member.view-model';
import { UserModel } from '../../models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../view-models/create-user/does-username-and-email-exist.view-model';

export class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    public async createUser(session: neo4j.Session, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string): Promise<UserModel> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.CreateUser)}`);
        const result = await session.run(query.data, { uId, email, username, password, passwordSalt, emailCode });

        const user = result.records.map(x => Database.createNodeObject(x.get('user')));
        if (user !== null && user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    }

    public async doesUsernameAndEmailExist(session: neo4j.Session, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.DoesUsernameAndEmailExist)}`);
        const result = await session.run(query.data, { email, username });
        if (result.records.length > 0) {
            const viewModel = new DoesUsernameAndEmailExist();
            viewModel.emailExist = result.records[0].get('emailExist');
            viewModel.usernameExist = result.records[0].get('usernameExist');
            return viewModel;
        } else {
            return null;
        }
    }

    public async getUser(session: neo4j.Session, emailOrUsername: string): Promise<UserModel> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.GetUser)}`);
        const result = await session.run(query.data, { emailOrUsername });

        const user = result.records.map(x => Database.createNodeObject(x.get('user')));
        if (user !== null && user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    }

    public async getUserById(session: neo4j.Session, userId: number): Promise<UserModel> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.GetUserById)}`);
        const result = await session.run(query.data, { userId });

        const user = result.records.map(x => Database.createNodeObject(x.get('user')));
        if (user !== null && user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    }

    public async forgotPassword(session: neo4j.Session, email: string, code: string): Promise<UserModel> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.AddForgottenPasswordCode)}`);
        const result = await session.run(query.data, { email, code });

        const user = result.records.map(x => Database.createNodeObject(x.get('user')));
        if (user !== null && user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    }

    public async changeForgottenPassword(session: neo4j.Session, email: string, code: string, password: string, passwordSalt: string): Promise<UserModel> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.ChangeForgottenPassword)}`);
        const result = await session.run(query.data, { email, code, password, passwordSalt });

        const user = result.records.map(x => Database.createNodeObject(x.get('user')));
        if (user !== null && user.length > 0) {
            return user[0];
        } else {
            return null;
        }
    }

    public async createNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.CreateNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async deleteNewsletterMember(session: neo4j.Session, viewModel: NewsletterMemberViewModel): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.DeleteNewsletterMember)}`);
        const result = await session.run(query.data, { email: viewModel.email });

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    public async verifyEmail(session: neo4j.Session, userId: number, code: string): Promise<boolean> {
        const query = require(`../../core/database/queries/${this.getQueryPath(Folder.Users, Users.VerifyEmail)}`);
        const result = await session.run(query.data, { userId, code });

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return null;
        }
    }
}
