export const data = `
MATCH (user:User { id: {userId} })
RETURN user
`