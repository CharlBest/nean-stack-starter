export const data = `
MATCH (user:User { id: $userId })

CREATE (payment:Payment { amount: $amount, chargeId: $chargeId, chargeCreated: $chargeCreated, dateCreated: timestamp() })

MERGE (user)-[rel:PAYED]->(payment)
`