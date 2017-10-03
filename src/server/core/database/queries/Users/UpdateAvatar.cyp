export const data = `
MATCH (user:User { id: {userId} })
SET user.avatarUrl = {avatarUrl}
RETURN user
`