export const data = `
MATCH (user:User { id: {userId} })-[rel:HAS_FAVOURITE]->(item:Item { uId: {uId} })

DELETE rel

SET user.favouriteCount = SIZE((user)-[:HAS_FAVOURITE]->())
SET item.favouriteCount = SIZE((item)<-[:HAS_FAVOURITE]-())

RETURN item.uId
`