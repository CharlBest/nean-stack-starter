export const data = `
MATCH (users:User { id: $userId })-[rel:SUBSCRIBED]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)

RETURN properties(items) as items,
collect(properties(files)) as files,
users
{
    id: users.id,
    username: users.username,
    avatar: collect(properties(avatars))[0]
}

ORDER BY rel.dateCreated DESC
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`