export const data = `
MATCH (user:User)-[:HAS_ITEM]->(item:Item { uId: $uId })

// Capture views (only once per user or IP address)
OPTIONAL MATCH (viewingUser:User { id: $userId })
FOREACH (o IN CASE WHEN viewingUser IS NOT NULL THEN [viewingUser] ELSE [] END |
    MERGE (item)<-[viewed:VIEWED]-(viewingUser)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateCreated) THEN [] ELSE [viewed] END | SET viewed.dateCreated = timestamp() )
)
FOREACH (o IN CASE WHEN viewingUser IS NULL THEN [1] ELSE [] END |
    MERGE (address:IpAddress { ip: $ip })
    MERGE (item)<-[viewed:VIEWED]-(address)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateCreated) THEN [] ELSE [viewed] END | SET viewed.dateCreated = timestamp() )
)
SET item.views = SIZE(()-[:VIEWED]->(item))

WITH viewingUser, item, user

OPTIONAL MATCH (viewingUser)-[favourite:HAS_FAVOURITE]->(item)
OPTIONAL MATCH (viewingUser)-[subscribed:SUBSCRIBED]->(item)
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
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite,
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed
`