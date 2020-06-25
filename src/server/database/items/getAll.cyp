export const data = `
MATCH (users:User)-[:HAS_ITEM]->(items:Item)
OPTIONAL MATCH (items)-[:TAG]->(itemTags:Tag)

// Filter items on tags
WITH users, items, collect(itemTags.name) as tags
WHERE $tags IS NULL OR ALL(tag IN $tags WHERE tag IN tags)

OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (:User { id: $userId })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: $userId })-[subscribed:SUBSCRIBED]->(items)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)

RETURN properties(items) as items, 
collect(properties(files)) as files,
tags,
users
{
    id: users.id,
    username: users.username,
    avatar: collect(properties(avatars))[0]
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite,
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed

ORDER BY items.dateCreated DESC
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`