export const data = `
MATCH (user:User { id: {userId} })
CREATE (payment:Payment { token: {token}, amount: {amount}, dateCreated: timestamp() })

FOREACH (o IN CASE WHEN user IS NOT NULL THEN [1] ELSE [] END |
    MERGE (user)-[rel:PAYED]->(payment)
)
`