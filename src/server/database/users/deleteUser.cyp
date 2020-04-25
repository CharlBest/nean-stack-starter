export const data = `
MATCH (user:User { id: $userId })
DETACH DELETE user
`