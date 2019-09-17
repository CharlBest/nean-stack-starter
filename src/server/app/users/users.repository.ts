import { FileModel } from '@shared/models/shared/file.model';
import { UserLiteModel } from '@shared/models/user/user-lite.model';
import { UserModel } from '@shared/models/user/user.model';
import { DoesUsernameAndEmailExist } from '@shared/view-models/create-user/does-username-and-email-exist.view-model';
import { ItemViewModel } from '@shared/view-models/item/item.view-model';
import { CompletedTutorial } from '@shared/view-models/tutorial/completed-tutorial.view-model';
import { UserProfileViewModel } from '@shared/view-models/user/user-profile.view-model';
import { UserPublicViewModel } from '@shared/view-models/user/user-public.view-model';
import { Response } from 'express';
import { Database } from '../../core/database';
import { BaseRepository } from '../shared/base-repository';

class UsersRepository extends BaseRepository {

    constructor() {
        super();
    }

    async createUser(res: Response, uId: string, email: string, username: string, passwordHash: string, emailCode: string)
        : Promise<Pick<UserModel, 'email' | 'username' | 'emailCode'> | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.createUser,
            {
                uId,
                email,
                username,
                passwordHash,
                emailCode
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async doesUsernameAndEmailExist(res: Response, email: string, username: string): Promise<DoesUsernameAndEmailExist | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.doesUsernameAndEmailExist,
            {
                email,
                username
            }
        );

        const model = result.records.map(record => {
            const localModel = new DoesUsernameAndEmailExist();
            localModel.emailExist = record.get('emailExist');
            localModel.usernameExist = record.get('usernameExist');
            return localModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserByEmailOrUsername(res: Response, emailOrUsername: string): Promise<UserLiteModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getUserByEmailOrUsername,
            {
                emailOrUsername
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getLiteUserById(res: Response, userId: number): Promise<UserLiteModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getLiteUserById,
            {
                userId
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserById(res: Response, userId: number): Promise<UserModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getUserById,
            {
                userId
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('user'),
                paymentCards: record.get('cards'),
            } as UserModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserProfile(res: Response, userId: number): Promise<UserProfileViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getUserProfile,
            {
                userId
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('user'),
                avatar: record.get('avatar'),
                paymentCards: record.get('cards'),
            } as UserProfileViewModel;
        });

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserPublic(res: Response, loggedInUserId: number | null, ip: string, userId: number)
        : Promise<UserPublicViewModel | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getUserPublic,
            {
                userId,
                loggedInUserId,
                ip
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async getUserPublicItems(res: Response, loggedInUserId: number | null, userId: number, pageIndex: number, pageSize: number)
        : Promise<ItemViewModel[] | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.getUserPublicItems,
            {
                userId,
                loggedInUserId,
                pageIndex,
                pageSize
            }
        );

        const model = result.records.map(record => {
            return {
                ...record.get('items'),
                files: record.get('files'),
                user: record.get('users'),
                favourite: record.get('favourite'),
                subscribed: record.get('subscribed'),
            } as ItemViewModel;
        });

        if (model && model.length > 0) {
            return model;
        } else {
            return null;
        }
    }

    async forgotPassword(res: Response, email: string, code: string): Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.addForgottenPasswordCode,
            {
                email,
                code
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async changeForgottenPassword(res: Response, email: string, code: string, passwordHash: string)
        : Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.changeForgottenPassword,
            {
                email,
                code,
                passwordHash
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async verifyEmail(res: Response, userId: number, code: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.verifyEmail,
            {
                userId,
                code
            }
        );

        if (result && result.records && result.records.length > 0) {
            return result.records[0].get('userExist');
        } else {
            return false;
        }
    }

    async updateAvatar(res: Response, userId: number, avatar: FileModel | null): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.updateAvatar,
            {
                userId,
                avatar
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async updateBio(res: Response, userId: number, bio: string): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.updateBio,
            {
                userId,
                bio
            }
        );

        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async updatePassword(res: Response, userId: number, passwordHash: string): Promise<Pick<UserModel, 'email'> | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.updatePassword,
            {
                userId,
                passwordHash
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    async deleteUser(res: Response, userId: number): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.deleteUser,
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
        const result = await res.locals.neo4jSession.run(Database.queries.users.completedTutorial,
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

    async updateTwoFactorAuthentication(res: Response, userId: number, isEnabled: boolean, generatedSecret: string | null)
        : Promise<Pick<UserModel, 'email' | 'twoFactorAuthenticationSecret'> | null> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.updateTwoFactorAuthentication,
            {
                userId,
                isEnabled,
                generatedSecret
            }
        );

        const model = result.records.map(record => record.get('user'));

        if (model && model.length > 0) {
            return model[0];
        } else {
            return null;
        }
    }

    // tslint:disable-next-line: bool-param-default
    async updateConfiguration(res: Response, userId: number, consent: boolean | undefined, darkTheme: boolean | undefined,
        language: string | undefined): Promise<boolean> {
        const result = await res.locals.neo4jSession.run(Database.queries.users.updateConfiguration,
            {
                userId,
                consent,
                darkTheme,
                language,
            }
        );

        if (result.records) {
            return true;
        } else {
            return false;
        }
    }
}

export const usersRepository = new UsersRepository();
