export const data = `
MATCH (users:User { id: $userId })-[:HAS_ITEM]->(items:Item)
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

OPTIONAL MATCH (:User { id: $loggedInUserId })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: $loggedInUserId })-[subscribed:SUBSCRIBED]->(items)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (items)-[:TAG]->(tags:Tag)

RETURN properties(items) as items,
collect(properties(files)) as files,
collect(tags.name) as tags,
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