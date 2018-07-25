export const data = `
MATCH (user:User { id: {userId} })

CREATE (payment:Payment { paymentUId: {paymentUId}, amount: {amount}, chargeId: {chargeId}, chargeCreated: {chargeCreated}, dateCreated: timestamp() })

OPTIONAL MATCH (user)-[:HAS_CARD]->(card:Card { uId: {cardUId} })

FOREACH (o IN CASE WHEN card IS NOT NULL THEN [1] ELSE [] END |
    MERGE (card)-[rel:PAYED]->(payment)
)

FOREACH (o IN CASE WHEN card IS NULL THEN [1] ELSE [] END |
    MERGE (user)-[rel:PAYED]->(payment)
)
`