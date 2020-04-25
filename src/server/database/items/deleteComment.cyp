export const data = `
MATCH (user:User { id: $userId })-[:MADE_COMMENT]->(comment:Comment { uId: $uId })<-[:HAS_COMMENT]-(item:Item)
DETACH DELETE comment

SET user.commentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.commentCount = SIZE((item)-[:HAS_COMMENT]->())
`