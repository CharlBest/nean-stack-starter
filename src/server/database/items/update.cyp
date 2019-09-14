export const data = `
MATCH (user:User { id: {userId} })-[:HAS_ITEM]->(item:Item { uId: {uId} })
OPTIONAL MATCH (item)-[:HAS_FILE]->(files:File)

SET item.title = {title}
SET item.description = {description}

RETURN properties(item) as item,
collect(properties(files)) as files,
user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`