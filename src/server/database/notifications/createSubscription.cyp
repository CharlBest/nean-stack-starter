export const data = `
MATCH (user:User { id: {userId} }), (item:Item { uId: {uId} })

MERGE (user)-[:SUBSCRIBED { dateCreated: timestamp() }]->(item)

SET user.itemSubscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
SET item.itemSubscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())

RETURN item.uId
`