export const data = `
MATCH (user:User { id: $userId })-[:MADE_COMMENT]->(comment:Comment { uId: $uId })<-[:HAS_COMMENT*]-(item:Item)

// Parent comment
OPTIONAL MATCH (parentComment:Comment)-[:HAS_COMMENT]->(comment)
OPTIONAL MATCH (comment)-[:HAS_COMMENT*]->(childComments:Comment)

DETACH DELETE comment

FOREACH (o IN CASE WHEN parentComment IS NOT NULL THEN [1] ELSE [] END |
    SET parentComment.commentCount = SIZE((parentComment)-[:HAS_COMMENT]->())
)

WITH user, item, childComments

// Child comments
FOREACH (o IN CASE WHEN childComments IS NOT NULL THEN [1] ELSE [] END |
    DETACH DELETE childComments
)

SET user.commentCount = SIZE((user)-[:MADE_COMMENT]->())
SET item.commentCount = SIZE((item)-[:HAS_COMMENT*]->())
`