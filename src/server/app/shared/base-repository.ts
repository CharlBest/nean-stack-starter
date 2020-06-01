
import { Response } from 'express';
import { int, isDateTime, Record } from 'neo4j-driver';
import { logger } from '../../core/utils/logger';

export abstract class BaseRepository {
    async run(res: Response, query: string, params: object): Promise<Array<Record> | null> {
        try {
            try {
                // Cast to Neo4j int
                for (const key of Object.keys(params)) {
                    const value = params[key];
                    if (Number.isInteger(value)) {
                        params[key] = int(value);
                    }
                }

                const result = await res.locals.neo4jSession.run(query, params);

                // TODO: Temp fix for DateTime objects to strings
                if (result.records) {
                    for (const record of result.records) {
                        for (const recordKey of record.keys) {
                            const object = record.get(recordKey);
                            if (!Array.isArray(object)) {
                                for (const key in object) {
                                    if (object.hasOwnProperty(key) && isDateTime(object[key])) {
                                        object[key] = object[key].toString();
                                    }
                                }
                            }
                        }
                    }
                }

                return result.records;
            } catch (error) {
                logger.error(error, [
                    BaseRepository.name,
                    params
                ]);
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
