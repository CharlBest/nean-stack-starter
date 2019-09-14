export const data = `
MATCH (users:User { id: {userId} })-[rel:SUBSCRIBED]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)

RETURN properties(items) as items,
collect(properties(files)) as files,
users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY rel.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`