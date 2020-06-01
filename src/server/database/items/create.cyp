export const data = `
// Auto increment user ids
OPTIONAL MATCH (nextItem:Item)
WITH nextItem, CASE WHEN nextItem IS NULL THEN 1 ELSE nextItem.id + 1 END as nextId
ORDER BY nextItem.id DESC
LIMIT 1

MATCH (user:User { id: $userId })
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

CREATE (user)-[:HAS_ITEM]->(item:Item { id: nextId, uId: $uId, title: $title, description: $description, dateCreated: datetime() })

// Create files
FOREACH (file IN $files |
    CREATE (newFile:File { uId: file.uId, url: file.url, width: file.width, height: file.height, aspectRatio: file.aspectRatio, exifOrientation: file.exifOrientation, rotation: file.rotation, dateCreated: datetime() })
    MERGE (item)-[:HAS_FILE]->(newFile)
)

// Tags
FOREACH (tag IN $tags |
	MERGE (tagNode:Tag { name: toLower(tag) })
	MERGE (item)-[:TAG { customName: tag }]->(tagNode)
	SET tagNode.links = SIZE(()-[:TAG]->(tagNode))
)

WITH item, user, avatars

OPTIONAL MATCH (item)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (item)-[:TAG]->(tags:Tag)

SET user.itemCount = SIZE((user)-[:HAS_ITEM]->())

// Subscribe to notifications
FOREACH (o IN CASE WHEN user.autoSubscribeToItem = true OR user.autoSubscribeToItem IS NULL THEN [1] ELSE [] END |
    MERGE (user)-[:SUBSCRIBED { dateCreated: datetime() }]->(item)
    SET user.subscriptionCount = SIZE((user)-[:SUBSCRIBED]->())
    SET item.subscriptionCount = SIZE((item)<-[:SUBSCRIBED]-())
)

RETURN properties(item) as item, 
collect(properties(files)) as files,
collect(tags.name) as tags,
user
{
    id: user.id,
    username: user.username,
    avatar: collect(properties(avatars))[0]
}
`