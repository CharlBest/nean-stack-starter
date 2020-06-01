export const data = `
MATCH (users:User { id: $userId })-[rel:SUBSCRIBED]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (items)-[:TAG]->(tags:Tag)

RETURN properties(items) as items,
collect(properties(files)) as files,
collect(tags.name) as tags,
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