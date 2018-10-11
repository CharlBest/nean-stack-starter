export const data = `
MATCH (user:User { id: {userId} }), (item:Item { uId: {uId} })

MERGE (user)-[:HAS_FAVOURITE { dateCreated: timestamp() }]->(item)

SET user.itemFavouriteCount = SIZE((user)-[:HAS_FAVOURITE]->())
SET item.itemFavouriteCount = SIZE((item)<-[:HAS_FAVOURITE]-())

RETURN item.uId
`