export const data = `
CALL db.index.fulltext.queryNodes('itemTitleAndDescription', {term}) YIELD node as items

MATCH (users:User)-[:HAS_ITEM]->(items)

OPTIONAL MATCH (:User { id: {userId} })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: {userId} })-[subscribed:SUBSCRIBED]->(items)

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