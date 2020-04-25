
import { Response } from 'express';
import { int, Record } from 'neo4j-driver';
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
