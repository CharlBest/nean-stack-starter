export const data = `
MATCH (user:User)-[:MADE_COMMENT]->(comment:Comment { uId: $uId })<-[:HAS_COMMENT]-(item:Item)
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

RETURN properties(comment) as comment,
user
{
    id: user.id,
    username: user.username,
    avatar: collect(properties(avatars))[0]
},
item.uId as itemUId
`