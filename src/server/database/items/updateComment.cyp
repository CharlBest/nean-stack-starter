export const data = `
MATCH (user:User { id: {userId} })-[:MADE_COMMENT]->(comment:Comment { uId: {uId} })

SET comment.description = {description}

RETURN comment, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`