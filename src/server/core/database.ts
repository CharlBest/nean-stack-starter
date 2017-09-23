import * as _ from 'lodash';
import { v1 as neo4j } from 'neo4j-driver';
import { environment } from '../environments/environment';

export class Database {

    static driver;

    static getSession(context: Request | any): any {
        if (context.neo4jSession) {
            return context.neo4jSession;
        } else {
            return this.createSession();
        }
    }

    private static createSession() {
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
        }

        // Register a callback to know if driver creation failed.
        // This could happen due to wrong credentials or database unavailability:
        (<any>driver).onError = (error) => {
            console.log('Neo4j driver instantiation failed', error);
        }

        return driver;
    }

    public static clearDriver() {
        if (this.driver) {
            this.driver.close();
            this.driver = null;
        }
    }

    public static createNodeObject(node): any {
        // TODO: potentially strongly type return type
        if (node !== null && node !== undefined) {
            const object = {};
            _.assign(object, node.properties);

            for (const key in object) {
                // check also if property is not inherited from prototype
                if (object.hasOwnProperty(key) && neo4j.isInt(object[key])) {
                    object[key] = neo4j.integer.toNumber(object[key]);
                }
            }

            return object;
        } else {
            return null;
        }
    }

    public static createNumber(int: any): any {
        // TODO: potentially strongly type return type
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
}
