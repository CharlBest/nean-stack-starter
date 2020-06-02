export const data = `
MATCH (user:User)-[:MADE_COMMENT]->(comment:Comment { uId: $uId })<-[:HAS_COMMENT]-(item:Item)
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