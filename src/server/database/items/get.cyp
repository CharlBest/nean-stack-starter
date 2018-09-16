export const data = `
MATCH (item:Item { uId: {uId} })
MATCH (user:User)-[:HAS_ITEM]->(item)

// Capture views (only once per user or IP address)
OPTIONAL MATCH (viewingUser:User { id: {userId} })
FOREACH (o IN CASE WHEN viewingUser IS NOT NULL THEN [viewingUser] ELSE [] END |
    MERGE (item)<-[viewed:VIEWED]-(viewingUser)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateTimeCreated) THEN [] ELSE [viewed] END | SET viewed.dateTimeCreated = timestamp() )
)
FOREACH (o IN CASE WHEN viewingUser IS NULL THEN [1] ELSE [] END |
    MERGE (address:IpAddress { ip: {ip} })
    MERGE (item)<-[viewed:VIEWED]-(address)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateTimeCreated) THEN [] ELSE [viewed] END | SET viewed.dateTimeCreated = timestamp() )
)
SET item.views = SIZE(()-[:VIEWED]->(item))

WITH viewingUser, item, user

OPTIONAL MATCH (viewingUser)-[favourite:HAS_FAVOURITE]->(item)

RETURN item, user
{
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite
`