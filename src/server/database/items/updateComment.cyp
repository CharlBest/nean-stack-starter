export const data = `
MATCH (user:User { id: $userId })-[:MADE_COMMENT]->(comment:Comment { uId: $uId })
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

SET comment.description = $description

RETURN properties(comment) as comment,
user
{
    id: user.id,
    username: user.username,
    avatar: collect(properties(avatars))[0]
}
`