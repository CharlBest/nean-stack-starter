export const data = `
MATCH (users:User { id: $userId })-[hasFavourite:HAS_FAVOURITE]->(items:Item)
OPTIONAL MATCH (items)-[:TAG]->(itemTags:Tag)

// Filter items on tags
WITH users, items, hasFavourite, collect(itemTags.name) as tags
WHERE $tags IS NULL OR ALL(tag IN $tags WHERE tag IN tags)

OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (users)-[subscribed:SUBSCRIBED]->(items)

WITH properties(items) as items, hasFavourite, collect(properties(files)) as files, tags, users, collect(properties(avatars))[0] as avatar, subscribed

RETURN items,
files,
tags,
users
{
    id: users.id,
    username: users.username,
    avatar: avatar
},
true as favourite,
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed

ORDER BY hasFavourite.order
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`