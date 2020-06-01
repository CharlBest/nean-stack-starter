export const data = `
// USING PERIODIC COMMIT
// Use these sites to generate uuids https://www.uuidgenerator.net/ OR https://www.guidgenerator.com/

// Auto increment user ids
OPTIONAL MATCH (nextItem:Item)
WITH nextItem, CASE WHEN nextItem IS NULL THEN 1 ELSE nextItem.id + 1 END as nextId
ORDER BY nextItem.id DESC
LIMIT 1

LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSoioj5JaAkyNq14cqaNZV59a7ptgepWy454AqeljjkP9Gfo3FR9V2iWSBtaaMtMVlB0Tbjvq2ddjjx/pub?gid=0&single=true&output=csv' as row

OPTIONAL MATCH (existingItem:Item { uId: row.uId })
FOREACH (nullRow IN CASE WHEN existingItem IS NULL THEN [row] ELSE [] END |
    MERGE (newItem:Item { uId: nullRow.uId })

    SET newItem.id = toInteger(nullRow.number) + nextId
    SET newItem.title = nullRow.title
    SET newItem.description = nullRow.description
    SET newItem.dateCreated = datetime()
)

WITH row

MATCH (user:User { id: 1 })
MATCH (item:Item { uId: row.uId })

MERGE (user)-[:HAS_ITEM]->(item)
SET user.itemCount = SIZE((user)-[:HAS_ITEM]->())

// Add tags
OPTIONAL MATCH (item)-[rel:TAG]->(oldTag:Tag)
DELETE rel

WITH item, oldTag, row

SET oldTag.links = SIZE(()-[:TAG]->(oldTag))
FOREACH (tag IN SPLIT(row.tags, ',') |
	MERGE (tagNode:Tag { name: toLower(tag) })
	MERGE (item)-[:TAG { customName: tag }]->(tagNode)
	SET tagNode.links = SIZE(()-[:TAG]->(tagNode))
)
`