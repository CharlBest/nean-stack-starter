export const data = `
MATCH (users:User { id: $userId })-[rel:HAS_FAVOURITE]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)

WITH items, rel, collect(properties(files)) as files, users, collect(properties(avatars))[0] as avatar

RETURN properties(items) as items,
files,
users
{
    id: users.id,
    username: users.username,
    avatar: avatar
}

ORDER BY rel.order
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`