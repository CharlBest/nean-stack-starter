export const data = `
MATCH (:User { id: {userId} })-[:HAS_CARD]->(:Card)-[rel:PAYED]->(payments:Payment)

RETURN payments
`