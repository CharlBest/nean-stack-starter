export const data = `
MATCH (user:User { id: {userId} })-[:HAS_ITEM]->(item:Item { uId: {uId} })
OPTIONAL MATCH (item)-[:HAS_FILE]->(oldFiles:File)

DETACH DELETE oldFiles

SET item.title = {title}
SET item.description = {description}

WITH DISTINCT item, user

// Create files
FOREACH (file IN {files} |
    CREATE (newFile:File { uId: file.uId, url: file.url, width: file.width, height: file.height, aspectRatio: file.aspectRatio, exifOrientation: file.exifOrientation, rotation: file.rotation, dateCreated: timestamp() })
    MERGE (item)-[:HAS_FILE]->(newFile)
)

WITH item, user

OPTIONAL MATCH (item)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

RETURN properties(item) as item,
collect(properties(files)) as files,
user
{
    id: user.id,
    username: user.username,
    avatar: collect(properties(avatars))[0]
}
`