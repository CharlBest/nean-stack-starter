export const data = `
// Auto increment user ids
OPTIONAL MATCH (nextItem:Item)
WITH nextItem, CASE WHEN nextItem IS NULL THEN 1 ELSE nextItem.id + 1 END as nextId
ORDER BY nextItem.id DESC
LIMIT 1

MATCH (user:User { id: {userId} })

CREATE (user)-[:HAS_ITEM]->(item:Item { id: nextId, uId: {uId}, title: {title}, description: {description}, dateCreated: timestamp() })

WITH item, user

// Create files
FOREACH (file IN {files} |
    CREATE (newFile:File { uId: file.uId, url: file.url, width: file.width, height: file.height, aspectRatio: file.aspectRatio, exifOrientation: file.exifOrientation, rotation: file.rotation, dateCreated: timestamp() })
    MERGE (item)-[:HAS_FILE]->(newFile)
)

WITH item, user

OPTIONAL MATCH (item)-[:HAS_FILE]->(files:File)

SET user.itemCount = SIZE((user)-[:HAS_ITEM]->())

// Subscribe to notifications
FOREACH (o IN CASE WHEN user.autoSubscribeToItem = true OR user.autoSubscribeToItem IS NULL THEN [1] ELSE [] END |
    MERGE (user)-[:SUBSCRIBED { dateCreated: timestamp() }]->(item)
    SET user.subscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
    SET item.subscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())
)

RETURN properties(item) as item, 
collect(properties(files)) as files,
user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
}
`