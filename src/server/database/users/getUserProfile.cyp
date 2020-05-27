export const data = `
MATCH (user:User { id: $userId })
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatar:File)

RETURN properties(user) as user,
properties(avatar) as avatar
`