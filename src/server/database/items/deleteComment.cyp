export const data = `
MATCH (user:User { id: {userId} })-[:MADE_COMMENT]->(comment:Comment { uId: {uId} })<-[:HAS_COMMENT]-(item:Item)
DETACH DELETE comment

SET user.itemCommentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.itemCommentCount = SIZE((item)-[:HAS_COMMENT]->())
`