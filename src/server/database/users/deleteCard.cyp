export const data = `
MATCH (user:User { id: {userId} })-[:HAS_CARD]->(card:Card { uId: {cardUId} })
DETACH DELETE card
`