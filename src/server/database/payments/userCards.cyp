export const data = `
MATCH (user:User { id: {userId} })-[:HAS_CARD]->(card:Card)

RETURN card
`