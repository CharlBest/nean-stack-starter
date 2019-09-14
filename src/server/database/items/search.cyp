export const data = `
CALL db.index.fulltext.queryNodes('itemTitleAndDescriptionIndex', {term}) YIELD node as items

MATCH (users:User)-[:HAS_ITEM]->(items)

OPTIONAL MATCH (:User { id: {userId} })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: {userId} })-[subscribed:SUBSCRIBED]->(items)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)

RETURN properties(items) as items,
collect(properties(files)) as files,
users
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