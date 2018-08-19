import * as _ from 'lodash';
import { v1 as neo4j } from 'neo4j-driver';
import { environment } from '../environments/environment';

export class Database {

    static driver;
    static fileExtension = 'cyp';

    public static createSession() {
        if (this.driver) {
            return this.driver.session();
        } else {
            const driver = this.createDriver();
            return driver.session();
        }
    }

    private static createDriver() {
        const driver = neo4j.driver(environment.database.uri, neo4j.auth.basic(environment.database.username, environment.database.password));

        // Register a callback to know if driver creation was successful:
        (<any>driver).onCompleted = () => {
            // proceed with using the driver, it was successfully instantiated
        };

        // Register a callback to know if driver creation failed.
        // This could happen due to wrong credentials or database unavailability:
        (<any>driver).onError = (error) => {
            console.log('Neo4j driver instantiation failed', error);
        };

        return driver;
    }

    public static clearDriver() {
        if (this.driver) {
            this.driver.close();
            this.driver = null;
        }
    }

    public static createNodeObject<T>(node): T {
        if (node) {
            let object = {};
            _.assign(object, node.properties);

            object = Database.parseValues(object);

            return <T>object;
        } else {
            return null;
        }
    }

    public static createNodeObjectArray(nodes: any[]): any {
        if (nodes) {
            return nodes.map(x => Database.createNodeObject(x));
        } else {
            return null;
        }
    }

    public static parseValues<T>(object: Object): T {
        for (const key in object) {
            // check also if property is not inherited from prototype
            if (object.hasOwnProperty(key) && neo4j.isInt(object[key])) {
                object[key] = neo4j.integer.toNumber(object[key]);
            }
        }

        return <T>object;
    }

    public static async retrieveQueries() {
        const dbQueries: DbQueries = {
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
                getLiteUserByEmailOrUsername: (await import(`../database/users/getLiteUserByEmailOrUsername.${Database.fileExtension}`)).data,
                getLiteUserById: (await import(`../database/users/getLiteUserById.${Database.fileExtension}`)).data,
                getUserById: (await import(`../database/users/getUserById.${Database.fileExtension}`)).data,
                getUserPublic: (await import(`../database/users/getUserPublic.${Database.fileExtension}`)).data,
                verifyEmail: (await import(`../database/users/verifyEmail.${Database.fileExtension}`)).data,
                updateAvatar: (await import(`../database/users/updateAvatar.${Database.fileExtension}`)).data,
                updateBio: (await import(`../database/users/updateBio.${Database.fileExtension}`)).data,
                updatePassword: (await import(`../database/users/updatePassword.${Database.fileExtension}`)).data,
                deleteUser: (await import(`../database/users/deleteUser.${Database.fileExtension}`)).data,
                completedTutorial: (await import(`../database/users/completedTutorial.${Database.fileExtension}`)).data,
            },
            payments: {
                anonymousPayment: (await import(`../database/payments/anonymousPayment.${Database.fileExtension}`)).data,
                userPayment: (await import(`../database/payments/userPayment.${Database.fileExtension}`)).data,
                userCards: (await import(`../database/payments/userCards.${Database.fileExtension}`)).data,
                createCard: (await import(`../database/payments/createCard.${Database.fileExtension}`)).data,
                deleteCard: (await import(`../database/payments/deleteCard.${Database.fileExtension}`)).data,
                updateDefaultCard: (await import(`../database/payments/updateDefaultCard.${Database.fileExtension}`)).data,
                paymentHistory: (await import(`../database/payments/paymentHistory.${Database.fileExtension}`)).data,
            },
            items: {
                create: (await import(`../database/items/create.${Database.fileExtension}`)).data,
                update: (await import(`../database/items/update.${Database.fileExtension}`)).data,
                get: (await import(`../database/items/get.${Database.fileExtension}`)).data,
                getAll: (await import(`../database/items/getAll.${Database.fileExtension}`)).data,
                delete: (await import(`../database/items/delete.${Database.fileExtension}`)).data,
            },
        };

        return dbQueries;
    }
}

export interface DbQueries {
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
        getLiteUserByEmailOrUsername: string,
        getLiteUserById: string,
        getUserById: string,
        getUserPublic: string,
        verifyEmail: string,
        updateAvatar: string,
        updateBio: string,
        updatePassword: string,
        deleteUser: string,
        completedTutorial: string,
    };

    payments: {
        anonymousPayment: string,
        userPayment: string,
        userCards: string,
        createCard: string,
        deleteCard: string,
        updateDefaultCard: string,
        paymentHistory: string,
    };

    items: {
        create: string,
        update: string,
        get: string,
        getAll: string,
        delete: string,
    };
}
