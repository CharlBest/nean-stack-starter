export const data = `
MATCH (users:User { id: $userId })-[subscription:SUBSCRIBED]->(items:Item)
OPTIONAL MATCH (items)-[:TAG]->(itemTags:Tag)

// Filter items on tags
WITH users, items, subscription, collect(itemTags.name) as tags
WHERE $tags IS NULL OR ALL(tag IN $tags WHERE tag IN tags)

OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)
OPTIONAL MATCH (users)-[favourite:HAS_FAVOURITE]->(items)

WITH properties(items) as items, subscription, collect(properties(files)) as files, tags, users, collect(properties(avatars))[0] as avatar, favourite

RETURN items,
files,
tags,
users
{
    id: users.id,
    username: users.username,
    avatar: avatar
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite,
CASE WHEN subscription IS NOT NULL THEN true ELSE false END as subscribed

ORDER BY subscription.dateCreated DESC
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`