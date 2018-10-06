export const data = `
MATCH (user:User { id: {userId} })
OPTIONAL MATCH (user)-[:HAS_CARD]->(cards: Card)
RETURN properties(user) as user, collect(properties(cards)) as cards
`