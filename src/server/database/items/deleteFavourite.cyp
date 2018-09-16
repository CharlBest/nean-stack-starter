export const data = `
MATCH (user:User { id: {userId} })-[rel:HAS_FAVOURITE]->(item:Item { uId: {uId} })
DELETE rel
RETURN item.uId
`