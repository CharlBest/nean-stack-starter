export const data = `
MATCH (user:User { id: {userId} }), (item:Item { uId: {uId} })

MERGE (user)-[:HAS_FAVOURITE { dateCreated: timestamp() }]->(item)

SET user.favouriteCount = SIZE((user)-[:HAS_FAVOURITE]->())
SET item.favouriteCount = SIZE((item)<-[:HAS_FAVOURITE]-())

RETURN item.uId
`