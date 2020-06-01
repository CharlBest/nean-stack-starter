export const data = `
MATCH (user:User { id: $userId }), (item:Item { uId: $uId })

MERGE (user)-[:SUBSCRIBED { dateCreated: datetime() }]->(item)

SET user.subscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.subscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`