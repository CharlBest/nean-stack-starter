export const data = `
MATCH (user:User { id: {userId} })-[:HAS_ITEM]->(item:Item { uId: {uId} })

SET item.title = {title}
SET item.description = {description}
SET item.media = {media}

RETURN properties(item) as item, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`