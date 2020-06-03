export const data = `
// For now only allow authenticated users to report/flag something
MATCH (user:User { id: $userId })

OPTIONAL MATCH (reportUser:User { id: $uId })
OPTIONAL MATCH (item:Item { id: $uId })
OPTIONAL MATCH (comment:Comment { id: $uId })

FOREACH (o IN CASE WHEN $type = 'USER' THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(reportUser)
)

FOREACH (o IN CASE WHEN $type = 'ITEM' THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(item)
)

FOREACH (o IN CASE WHEN $type = 'COMMENT' THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(comment)
)
`