export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextComment:Comment)
WITH nextComment, CASE WHEN nextComment IS NULL THEN 1 ELSE nextComment.id + 1 END as nextId
ORDER BY nextComment.id DESC
LIMIT 1

MATCH (user:User { id: $userId }), (item:Item { uId: $itemUId })

CREATE (user)-[:MADE_COMMENT]->(comment:Comment { id: nextId, uId: $uId, description: $description, dateCreated: datetime() })<-[:HAS_COMMENT]-(item)

SET user.commentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.commentCount = SIZE((item)-[:HAS_COMMENT]->())

WITH user, item, comment
MATCH (itemUser:User)-[:HAS_ITEM]->(item)
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (user)-[isItemOwner:HAS_ITEM]->(item)

RETURN properties(comment) as comment, 
user
{
    id: user.id,
    username: user.username,
    avatar: collect(properties(avatars))[0]
},
CASE WHEN isItemOwner IS NOT NULL THEN true ELSE false END as isItemOwner,
item.uId as itemUId
`