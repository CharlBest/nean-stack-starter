export const data = `
MATCH (items:Item)
MATCH (users:User)-[:HAS_ITEM]->(items)

RETURN items, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY items.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`