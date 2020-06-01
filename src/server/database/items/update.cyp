export const data = `
MATCH (user:User { id: $userId })-[:HAS_ITEM]->(item:Item { uId: $uId })
OPTIONAL MATCH (item)-[:HAS_FILE]->(oldFiles:File)

DETACH DELETE oldFiles

SET item.title = $title
SET item.description = $description

WITH DISTINCT item, user

// Create files
FOREACH (file IN $files |
    CREATE (newFile:File { uId: file.uId, url: file.url, width: file.width, height: file.height, aspectRatio: file.aspectRatio, exifOrientation: file.exifOrientation, rotation: file.rotation, dateCreated: datetime() })
    MERGE (item)-[:HAS_FILE]->(newFile)
)

WITH item, user

// Tags
OPTIONAL MATCH (item)-[rel:TAG]->(oldTag:Tag)
DELETE rel

SET oldTag.links = SIZE(()-[:TAG]->(oldTag))
FOREACH (tag IN $tags |
	MERGE (tagNode:Tag { name: toLower(tag) })
	MERGE (item)-[:TAG { customName: tag }]->(tagNode)
	SET tagNode.links = SIZE(()-[:TAG]->(tagNode))
)

WITH item, user

OPTIONAL MATCH (item)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (item)-[:TAG]->(tags:Tag)
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

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