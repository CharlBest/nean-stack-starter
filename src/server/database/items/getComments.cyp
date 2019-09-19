export const data = `
MATCH (:Item { uId: {uId} })-[:HAS_COMMENT]->(comments:Comment)<-[:MADE_COMMENT]-(users:User)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)

RETURN properties(comments) as comments,
users
{
    id: users.id,
    username: users.username,
    avatar: collect(properties(avatars))[0]
}

ORDER BY comments.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`