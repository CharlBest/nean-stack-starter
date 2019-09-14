export const data = `
MATCH (users:User { id: {userId} })-[rel:HAS_FAVOURITE]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
WITH items, rel, collect(properties(files)) as files, users

RETURN properties(items) as items,
files,
users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY rel.order
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`