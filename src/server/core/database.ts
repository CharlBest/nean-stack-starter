import { v1 as neo4j } from 'neo4j-driver';
import { environment } from '../environments/environment';
import { logger } from './utils/logger';

export class Database {

    static driver: neo4j.Driver;
    static fileExtension = 'cyp';
    static queries: DbQueries;

    private static createDriver() {
        const driver = neo4j.driver(
            environment.database.uri,
            neo4j.auth.basic(environment.database.username, environment.database.password),
            {
                disableLosslessIntegers: true,
                logging: {
                    level: 'warn',
                    logger: (level, message) => logger.log(level, `Neo4j - ${message}`)
                }
            }
        );

        // Register a callback to know if driver creation was successful:
        driver.onCompleted = () => {
            // proceed with using the driver, it was successfully instantiated
        };

        // Register a callback to know if driver creation failed.
        // This could happen due to wrong credentials or database unavailability:
        driver.onError = (error) => {
            logger.error('Neo4j driver instantiation failed', [error]);
        };

        return driver;
    }

    static createSession(): neo4j.Session {
        if (this.driver) {
            return this.driver.session();
        } else {
            this.driver = this.createDriver();
            return this.driver.session();
        }
    }

    static clearDriver(): void {
        if (this.driver) {
            this.driver.close();
        }
    }

    static async getQueries() {
        this.queries = {
            startup: {
                itemTitleAndDescriptionIndex:
                    (await import(`../database/startup/itemTitleAndDescriptionIndex.${Database.fileExtension}`)).data,
                userEmailAndUsernameIndex: (await import(`../database/startup/userEmailAndUsernameIndex.${Database.fileExtension}`)).data,
            },
            general: {
                createNewsletterMember: (await import(`../database/general/createNewsletterMember.${Database.fileExtension}`)).data,
                deleteNewsletterMember: (await import(`../database/general/deleteNewsletterMember.${Database.fileExtension}`)).data,
            },
            users: {
                addForgottenPasswordCode: (await import(`../database/users/addForgottenPasswordCode.${Database.fileExtension}`)).data,
                changeForgottenPassword: (await import(`../database/users/changeForgottenPassword.${Database.fileExtension}`)).data,
                createUser: (await import(`../database/users/createUser.${Database.fileExtension}`)).data,
                doesUserHavePermissions: (await import(`../database/users/doesUserHavePermissions.${Database.fileExtension}`)).data,
                doesUsernameAndEmailExist: (await import(`../database/users/doesUsernameAndEmailExist.${Database.fileExtension}`)).data,
                getUserByEmailOrUsername: (await import(`../database/users/getUserByEmailOrUsername.${Database.fileExtension}`)).data,
                getLiteUserById: (await import(`../database/users/getLiteUserById.${Database.fileExtension}`)).data,
                getUserById: (await import(`../database/users/getUserById.${Database.fileExtension}`)).data,
                getUserPublic: (await import(`../database/users/getUserPublic.${Database.fileExtension}`)).data,
                getUserPublicItems: (await import(`../database/users/getUserPublicItems.${Database.fileExtension}`)).data,
                verifyEmail: (await import(`../database/users/verifyEmail.${Database.fileExtension}`)).data,
                updateAvatar: (await import(`../database/users/updateAvatar.${Database.fileExtension}`)).data,
                updateBio: (await import(`../database/users/updateBio.${Database.fileExtension}`)).data,
                updatePassword: (await import(`../database/users/updatePassword.${Database.fileExtension}`)).data,
                deleteUser: (await import(`../database/users/deleteUser.${Database.fileExtension}`)).data,
                completedTutorial: (await import(`../database/users/completedTutorial.${Database.fileExtension}`)).data,
                updateTwoFactorAuthentication:
                    (await import(`../database/users/updateTwoFactorAuthentication.${Database.fileExtension}`)).data,
                updateConfiguration: (await import(`../database/users/updateConfiguration.${Database.fileExtension}`)).data,
            },
            payments: {
                anonymousPayment: (await import(`../database/payments/anonymousPayment.${Database.fileExtension}`)).data,
                userPayment: (await import(`../database/payments/userPayment.${Database.fileExtension}`)).data,
                paymentCards: (await import(`../database/payments/paymentCards.${Database.fileExtension}`)).data,
                createCard: (await import(`../database/payments/createCard.${Database.fileExtension}`)).data,
                deleteCard: (await import(`../database/payments/deleteCard.${Database.fileExtension}`)).data,
                updateDefaultCard: (await import(`../database/payments/updateDefaultCard.${Database.fileExtension}`)).data,
                paymentHistory: (await import(`../database/payments/paymentHistory.${Database.fileExtension}`)).data,
            },
            items: {
                create: (await import(`../database/items/create.${Database.fileExtension}`)).data,
                update: (await import(`../database/items/update.${Database.fileExtension}`)).data,
                get: (await import(`../database/items/get.${Database.fileExtension}`)).data,
                getItems: (await import(`../database/items/getItems.${Database.fileExtension}`)).data,
                delete: (await import(`../database/items/delete.${Database.fileExtension}`)).data,
                createFavourite: (await import(`../database/items/createFavourite.${Database.fileExtension}`)).data,
                deleteFavourite: (await import(`../database/items/deleteFavourite.${Database.fileExtension}`)).data,
                getFavourites: (await import(`../database/items/getFavourites.${Database.fileExtension}`)).data,
                orderFavourite: (await import(`../database/items/orderFavourite.${Database.fileExtension}`)).data,
                createComment: (await import(`../database/items/createComment.${Database.fileExtension}`)).data,
                updateComment: (await import(`../database/items/updateComment.${Database.fileExtension}`)).data,
                deleteComment: (await import(`../database/items/deleteComment.${Database.fileExtension}`)).data,
                getComments: (await import(`../database/items/getComments.${Database.fileExtension}`)).data,
                getComment: (await import(`../database/items/getComment.${Database.fileExtension}`)).data,
                search: (await import(`../database/items/search.${Database.fileExtension}`)).data,
            },
            notifications: {
                getNotificationPreferences:
                    (await import(`../database/notifications/getNotificationPreferences.${Database.fileExtension}`)).data,
                updateNotificationPreferences:
                    (await import(`../database/notifications/updateNotificationPreferences.${Database.fileExtension}`)).data,
                createSubscription: (await import(`../database/notifications/createSubscription.${Database.fileExtension}`)).data,
                deleteSubscription: (await import(`../database/notifications/deleteSubscription.${Database.fileExtension}`)).data,
                getSubscriptions: (await import(`../database/notifications/getSubscriptions.${Database.fileExtension}`)).data,
                getNewCommentNotification:
                    (await import(`../database/notifications/getNewCommentNotification.${Database.fileExtension}`)).data,
            },
        };
    }
}

export interface DbQueries {
    startup: {
        itemTitleAndDescriptionIndex: string,
        userEmailAndUsernameIndex: string,
    };

    general: {
        createNewsletterMember: string,
        deleteNewsletterMember: string,
    };

    users: {
        addForgottenPasswordCode: string,
        changeForgottenPassword: string,
        createUser: string,
        doesUserHavePermissions: string,
        doesUsernameAndEmailExist: string,
        getUserByEmailOrUsername: string,
        getLiteUserById: string,
        getUserById: string,
        getUserPublic: string,
        getUserPublicItems: string,
        verifyEmail: string,
        updateAvatar: string,
        updateBio: string,
        updatePassword: string,
        deleteUser: string,
        completedTutorial: string,
        updateTwoFactorAuthentication: string,
        updateConfiguration: string,
    };

    payments: {
        anonymousPayment: string,
        userPayment: string,
        paymentCards: string,
        createCard: string,
        deleteCard: string,
        updateDefaultCard: string,
        paymentHistory: string,
    };

    items: {
        create: string,
        update: string,
        get: string,
        getItems: string,
        delete: string,
        createFavourite: string,
        deleteFavourite: string,
        getFavourites: string,
        orderFavourite: string,
        createComment: string,
        updateComment: string,
        deleteComment: string,
        getComments: string,
        getComment: string,
        search: string,
    };

    notifications: {
        getNotificationPreferences: string,
        updateNotificationPreferences: string,
        createSubscription: string,
        deleteSubscription: string,
        getSubscriptions: string,
        getNewCommentNotification: string,
    };
}
