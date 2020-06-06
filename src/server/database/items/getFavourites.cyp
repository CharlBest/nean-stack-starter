export const data = `
MATCH (users:User { id: $userId })-[rel:HAS_FAVOURITE]->(items:Item)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (items)-[:TAG]->(tags:Tag)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)

OPTIONAL MATCH (users)-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (users)-[subscribed:SUBSCRIBED]->(items)

WITH properties(items) as items, rel, collect(properties(files)) as files, collect(tags.name) as tags, users, collect(properties(avatars))[0] as avatar, favourite, subscribed

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
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed

ORDER BY rel.order
SKIP $pageIndex*$pageSize
LIMIT $pageSize
`