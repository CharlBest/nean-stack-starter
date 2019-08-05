export const data = `
MATCH (users:User { id: {userId} })-[rel:HAS_FAVOURITE]->(items:Item)

RETURN properties(items) as items, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY rel.order
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`