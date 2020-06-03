export const data = `
// For now only allow authenticated users to report/flag something
MATCH (user:User { id: $userId })

OPTIONAL MATCH (reportUser:User { uId: $uId })
OPTIONAL MATCH (item:Item { uId: $uId })
OPTIONAL MATCH (comment:Comment { uId: $uId })

FOREACH (o IN CASE WHEN $type = 'USER' AND reportUser IS NOT NULL THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(reportUser)
)

FOREACH (o IN CASE WHEN $type = 'ITEM' AND item IS NOT NULL THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(item)
)

FOREACH (o IN CASE WHEN $type = 'COMMENT' AND comment IS NOT NULL THEN [1] ELSE [] END |
    MERGE (user)-[:REPORT]->(comment)
)
`