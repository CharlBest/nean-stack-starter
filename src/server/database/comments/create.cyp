export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextComment:Comment)
WITH nextComment, CASE WHEN nextComment IS NULL THEN 1 ELSE nextComment.id + 1 END as nextId
ORDER BY nextComment.id DESC
LIMIT 1

MATCH (user:User { id: $userId }), (item:Item { uId: $itemUId })
OPTIONAL MATCH (parentComment:Comment { uId: $commentUId })

CREATE (user)-[:MADE_COMMENT]->(comment:Comment { id: nextId, uId: $uId, description: $description, dateCreated: datetime() })

// Create top level comment
FOREACH (o IN CASE WHEN parentComment IS NULL THEN [1] ELSE [] END |
    CREATE (item)-[:HAS_COMMENT]->(comment)
)

// Create reply
FOREACH (o IN CASE WHEN parentComment IS NOT NULL THEN [1] ELSE [] END |
    CREATE (parentComment)-[:HAS_COMMENT]->(comment)
    SET parentComment.commentCount = SIZE((parentComment)-[:HAS_COMMENT]->())
)

SET user.commentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.commentCount = SIZE((item)-[:HAS_COMMENT*]->())

WITH user, item, comment
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