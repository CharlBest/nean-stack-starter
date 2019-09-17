export const data = `
MATCH (user:User { id: {userId} })
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatar:File)

DETACH DELETE avatar

WITH user

FOREACH (file IN CASE WHEN {avatar} IS NOT NULL THEN [{avatar}] ELSE [] END |
    CREATE (newAvatar:File { uId: file.uId, url: file.url, width: file.width, height: file.height, aspectRatio: file.aspectRatio, exifOrientation: file.exifOrientation, rotation: file.rotation, dateCreated: timestamp() })
    MERGE (user)-[:HAS_AVATAR]->(newAvatar)
)
`