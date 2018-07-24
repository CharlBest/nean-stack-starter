export const data = `
MATCH (user:User { id: {userId} })
OPTIONAL MATCH (user)-[:HAS_CARD]->(cards: Card)
RETURN user, cards
`