export const data = `
MATCH (items:Item)-[:HAS_COMMENT*]->(:Comment { uId: $uId })-[:HAS_COMMENT]->(comments:Comment)<-[:MADE_COMMENT]-(users:User)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (users)-[isItemOwner:HAS_ITEM]->(items)

RETURN properties(comments) as comments,
users
{
    id: users.id,
    username: users.username,
    avatar: collect(properties(avatars))[0]
},
CASE WHEN isItemOwner IS NOT NULL THEN true ELSE false END as isItemOwner,
items.uId as itemUId

ORDER BY comments.dateCreated DESC
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`