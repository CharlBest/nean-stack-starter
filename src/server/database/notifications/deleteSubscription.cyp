export const data = `
MATCH (user:User { id: $userId })-[rel:SUBSCRIBED]->(item:Item { uId: $uId })

DELETE rel

SET user.subscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.subscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`