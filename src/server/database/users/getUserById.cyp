export const data = `
MATCH (user:User { id: $userId })

RETURN properties(user) as user
`