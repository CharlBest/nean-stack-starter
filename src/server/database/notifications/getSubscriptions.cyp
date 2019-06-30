export const data = `
MATCH (users:User { id: {userId} })-[rel:SUBSCRIBED]->(items:Item)

RETURN properties(items) as items, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY rel.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`