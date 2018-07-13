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
        if (node !== null && node !== undefined) {
            const object = {};
            _.assign(object, node.properties);

            for (const key in object) {
                // check also if property is not inherited from prototype
                if (object.hasOwnProperty(key) && neo4j.isInt(object[key])) {
                    object[key] = neo4j.integer.toNumber(object[key]);
                }
            }

            return <T>object;
        } else {
            return null;
        }
    }

    public static createNodeObjectArray(nodes: any[]): any {
        return nodes.map(x => Database.createNodeObject(x));
    }

    public static createNumber(int: any): number {
        if (int !== null && int !== undefined) {
            if (neo4j.isInt(int)) {
                return neo4j.integer.toNumber(int);
            } else {
                return int;
            }
        } else {
            return null;
        }
    }

    public static async retrieveQueries() {
        return {
            general: {
                createNewsletterMember: (await import(`../database/general/createNewsletterMember.${Database.fileExtension}`)).data,
                deleteNewsletterMember: (await import(`../database/general/deleteNewsletterMember.${Database.fileExtension}`)).data,
                paymentRequest: (await import(`../database/general/paymentRequest.${Database.fileExtension}`)).data
            },
            users: {
                addForgottenPasswordCode: (await import(`../database/users/addForgottenPasswordCode.${Database.fileExtension}`)).data,
                changeForgottenPassword: (await import(`../database/users/changeForgottenPassword.${Database.fileExtension}`)).data,
                createUser: (await import(`../database/users/createUser.${Database.fileExtension}`)).data,
                doesUserHavePermissions: (await import(`../database/users/doesUserHavePermissions.${Database.fileExtension}`)).data,
                doesUsernameAndEmailExist: (await import(`../database/users/doesUsernameAndEmailExist.${Database.fileExtension}`)).data,
                getUser: (await import(`../database/users/getUser.${Database.fileExtension}`)).data,
                getUserById: (await import(`../database/users/getUserById.${Database.fileExtension}`)).data,
                verifyEmail: (await import(`../database/users/verifyEmail.${Database.fileExtension}`)).data,
                updateAvatar: (await import(`../database/users/updateAvatar.${Database.fileExtension}`)).data,
                updateBio: (await import(`../database/users/updateBio.${Database.fileExtension}`)).data,
                updatePassword: (await import(`../database/users/updatePassword.${Database.fileExtension}`)).data,
                deleteUser: (await import(`../database/users/deleteUser.${Database.fileExtension}`)).data,
                completedTutorial: (await import(`../database/users/completedTutorial.${Database.fileExtension}`)).data
            }
        };
    }
}
