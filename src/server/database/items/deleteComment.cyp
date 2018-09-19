export const data = `
MATCH (user:User { id: {userId} })-[:MADE_COMMENT]->(comment:Comment { uId: {uId} })
DETACH DELETE comment
`