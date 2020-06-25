export const data = `
MATCH (user:User { id: $userId }), (item:Item { uId: $uId })

MERGE (user)-[hasFavourite:HAS_FAVOURITE { dateCreated: datetime() }]->(item)

SET user.favouriteCount = SIZE((user)-[:HAS_FAVOURITE]->())
SET item.favouriteCount = SIZE((item)<-[:HAS_FAVOURITE]-())
SET hasFavourite.order = SIZE((user)-[:HAS_FAVOURITE]->()) - 1

RETURN item.uId
`