export const data = `
MATCH (user:User { id: {userId} }), (item:Item { uId: {uId} })
MERGE (user)-[:HAS_FAVOURITE]->(item)
RETURN item.uId
`