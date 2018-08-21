export const data = `
MATCH (item:Item { uId: {uId} })
MATCH (user:User)-[:HAS_ITEM]->(item)

RETURN item, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`