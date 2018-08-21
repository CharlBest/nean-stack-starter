export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextItem:Item)
WITH nextItem, CASE WHEN nextItem IS NULL THEN 1 ELSE nextItem.id + 1 END as nextId
ORDER BY nextItem.id DESC
LIMIT 1

MATCH (user:User { id: {userId} })

CREATE (user)-[:HAS_ITEM]->(item:Item { id: nextId, uId: {uId}, title: {title}, description: {description}, dateCreated: timestamp() })

RETURN item, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`