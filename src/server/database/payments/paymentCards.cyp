export const data = `
MATCH (user:User { id: $userId })-[:HAS_CARD]->(cards:Card)
RETURN properties(cards) as cards
`