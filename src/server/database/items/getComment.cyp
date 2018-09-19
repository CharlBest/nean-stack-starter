export const data = `
MATCH (user:User)-[:MADE_COMMENT]->(comment:Comment { uId: {uId} })<-[:HAS_COMMENT]-(item:Item)

RETURN comment, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
},
item.uId as itemUId
`