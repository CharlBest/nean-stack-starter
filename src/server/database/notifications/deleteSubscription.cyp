export const data = `
MATCH (user:User { id: $userId })-[subscribed:SUBSCRIBED]->(item:Item { uId: $uId })

DELETE subscribed

SET user.subscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.subscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`