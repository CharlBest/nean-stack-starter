export const data = `
MATCH (users)-[rel:SUBSCRIBED]->(items)-[:HAS_COMMENT]->(comment: Comment { uId: {commentUId} })<-[:MADE_COMMENT]-(owner:User)
WHERE users.pushSubscription IS NOT NULL AND 
users.pushNotificationEnabled = true AND 
users.pushNotificationTypes[0] = true AND 
users.uId <> owner.uId

RETURN collect(users.pushSubscription) as pushSubscriptions,
comment.description as description
`