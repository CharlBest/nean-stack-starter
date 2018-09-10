import { Response } from 'express';
import { ItemModel } from '../../../shared/models/item/item.model';
import { CardModel } from '../../../shared/models/payment/card.model';
import { UserLiteModel } from '../../../shared/models/user/user-lite.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '../../../shared/view-models/create-user/does-username-and-email-exist.view-model';
import { CompletedTutorial } from '../../../shared/view-models/tutorial/completed-tutorial.view-model';
import { UserPublicViewModel } from '../../../shared/view-models/user/user-public.view-model';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

export class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createUser(res: Response, uId: string, email: string, username: string, password: string, passwordSalt: string, emailCode: string)
        : Promise<Pick<UserModel, 'email' | 'username' | 'emailCode'>> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.createUser,
            {
                uId,
                email,
                username,
                password,
                passwordSalt,
                emailCode
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as any[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.doesUsernameAndEmailExist,
            {
                email,
                username
            }
        );

        const model = result.records.map(x => {
            const localModel = new DoesUsernameAndEmailExist();
            localModel.emailExist = x.get('emailExist');
            localModel.usernameExist = x.get('usernameExist');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserByEmailOrUsername(res: Response, emailOrUsername: string)
        : Promise<Pick<UserModel, 'password' | 'passwordSalt' | 'id'>> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserByEmailOrUsername,
            {
                emailOrUsername
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as any[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getLiteUserById(res: Response, userId: number): Promise<UserLiteModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getLiteUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as UserLiteModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserById(res: Response, userId: number): Promise<UserModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserById,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            let localModel = new UserModel();
            localModel = Database.createNodeObject(x.get('user')) as UserModel;
            localModel.userCards = Database.createNodeObjectArray(x.get('cards')) as CardModel[];
            return localModel;
        }) as UserModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserPublic(res: Response, userId: number): Promise<UserPublicViewModel> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.getUserPublic,
            {
                userId
            }
        );

        const model = result.records.map(x => {
            let localModel = new UserPublicViewModel();
            localModel = Database.parseValues(x.get('user')) as UserPublicViewModel;
            localModel.items = Database.createNodeObjectArray(x.get('items')) as ItemModel[];
            return localModel;
        }) as UserPublicViewModel[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async forgotPassword(res: Response, email: string, code: string): Promise<Pick<UserModel, 'email'>> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.addForgottenPasswordCode,
            {
                email,
                code
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as Pick<UserModel, 'email'>[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async changeForgottenPassword(res: Response, email: string, code: string, password: string, passwordSalt: string)
        : Promise<Pick<UserModel, 'email'>> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.changeForgottenPassword,
            {
                email,
                code,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as Pick<UserModel, 'email'>[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async verifyEmail(res: Response, userId: number, code: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.verifyEmail,
            {
                userId,
                code
            }
        );

        if (result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return null;
        }
    }

    async updateAvatar(res: Response, userId: number, avatarUrl: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updateAvatar,
            {
                userId,
                avatarUrl
            }
        );

        if (result) {
            return true;
        } else {
            return null;
        }
    }

    async updateBio(res: Response, userId: number, bio: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updateBio,
            {
                userId,
                bio
            }
        );

        if (result) {
            return true;
        } else {
            return null;
        }
    }

    async updatePassword(res: Response, userId: number, password: string, passwordSalt: string): Promise<Pick<UserModel, 'email'>> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.updatePassword,
            {
                userId,
                password,
                passwordSalt
            }
        );

        const model = result.records.map(x => Database.parseValues(x.get('user'))) as Pick<UserModel, 'email'>[];

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteUser(res: Response, userId: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.deleteUser,
            {
                userId
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }

    async completedTutorial(res: Response, userId: number, viewModel: CompletedTutorial): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(res.app.locals.dbQueries.users.completedTutorial,
            {
                userId,
                tutorialType: viewModel.tutorialType,
                didSkip: viewModel.didSkip
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}
