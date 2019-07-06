export const data = `
MATCH (users:User { id: {userId} })-[:HAS_ITEM]->(items:Item)

OPTIONAL MATCH (:User { id: {loggedInUserId} })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: {loggedInUserId} })-[subscribed:SUBSCRIBED]->(items)

RETURN properties(items) as items, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite,
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed

ORDER BY items.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`