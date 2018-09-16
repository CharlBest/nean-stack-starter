export const data = `
MATCH (items:Item), (users:User)-[:HAS_ITEM]->(items)

OPTIONAL MATCH (:User { id: {userId} })-[favourite:HAS_FAVOURITE]->(items)

RETURN items, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite

ORDER BY items.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`