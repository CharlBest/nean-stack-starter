export const data = `
MATCH (user:User { id: $userId })-[rel:SUBSCRIBED]->(item:Item { uId: $uId })

DELETE rel

SET user.favouriteCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.favouriteCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`