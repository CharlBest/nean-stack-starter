export const data = `
MATCH (user:User { id: {userId} })-[rel:SUBSCRIBED]->(item:Item { uId: {uId} })

DELETE rel

SET user.itemFavouriteCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.itemFavouriteCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`