export const data = `
MATCH (user:User { id: {userId} })
SET user.bio = {bio}
`