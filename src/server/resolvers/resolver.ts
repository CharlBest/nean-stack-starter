import { find, filter } from 'lodash';
import { v1 as neo4j } from 'neo4j-driver';

export default {
    Query: {
        movies(_, params) {
            const session = driver.session();
            const query = 'MATCH (movie:Movie) WHERE movie.title CONTAINS $subString RETURN movie LIMIT $limit;'
            return session.run(query, params)
                .then(result => {
                    return result.records.map(record => {
                        return record.get('movie').properties;
                    })
                })
        },
    },
    Movie: {
        similar(movie) {
            const session = driver.session(),
                params = { movieId: movie.movieId },
                query = `
              MATCH (m:Movie) WHERE m.movieId = $movieId
              MATCH (m)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(movie:Movie)
              WITH movie, COUNT(*) AS score
              RETURN movie ORDER BY score DESC LIMIT 3
            `
            return session.run(query, params)
                .then(result => {
                    return result.records.map(record => {
                        return record.get('movie').properties;
                    })
                })
        },
        genres(movie) {
            const session = driver.session(),
                params = { movieId: movie.movieId },
                query = `
                        MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
                        WHERE m.movieId = $movieId
                        RETURN g.name AS genre;
                        `
            return session.run(query, params)
                .then(result => {
                    return result.records.map(record => {
                        return record.get('genre')
                    });
                })
        }
    },
};

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
let driver;

export async function context(headers, secrets) {
    if (!driver) {
        driver = await neo4j.driver(secrets.NEO4J_URI, neo4j.auth.basic(secrets.NEO4J_USER, secrets.NEO4J_PASSWORD))
    }
    return {
        driver
    }
}
