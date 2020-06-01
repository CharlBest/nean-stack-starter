export const data = `
MERGE (tutorial:Tutorial { type: toInteger($tutorialType) })
WITH tutorial
MATCH (user:User { id: $userId })
OPTIONAL MATCH (user)-[hasCompleted:COMPLETED]->(tutorial)
OPTIONAL MATCH (user)-[hasSkipped:SKIPPED]->(tutorial)

FOREACH (o IN CASE WHEN hasCompleted IS NULL AND $didSkip = false THEN [1] ELSE [] END |
    MERGE (user)-[rel:COMPLETED]->(tutorial)
    SET rel.dateCreated = datetime()
)

FOREACH (o IN CASE WHEN hasSkipped IS NULL AND $didSkip THEN [1] ELSE [] END |
    MERGE (user)-[rel:SKIPPED]->(tutorial)
    SET rel.dateCreated = datetime()
)
`