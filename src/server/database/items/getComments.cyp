export const data = `
MATCH (:Item { uId: {uId} })-[:HAS_COMMENT]->(comments:Comment)<-[:MADE_COMMENT]-(users:User)

RETURN properties(comments) as comments, users
{
    id: users.id,
    username: users.username,
    avatarUrl: users.avatarUrl
}

ORDER BY comments.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`