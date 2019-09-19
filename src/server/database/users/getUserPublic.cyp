export const data = `
MATCH (user:User { id: {userId} })
OPTIONAL MATCH (user)-[:HAS_AVATAR]->(avatars:File)

// Capture views (only once per user or IP address)
OPTIONAL MATCH (viewingUser:User { id: {loggedInUserId} })
FOREACH (o IN CASE WHEN viewingUser IS NOT NULL THEN [viewingUser] ELSE [] END |
    MERGE (user)<-[viewed:VIEWED]-(viewingUser)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateTimeCreated) THEN [] ELSE [viewed] END | SET viewed.dateTimeCreated = timestamp() )
)
FOREACH (o IN CASE WHEN viewingUser IS NULL THEN [1] ELSE [] END |
    MERGE (address:IpAddress { ip: {ip} })
    MERGE (user)<-[viewed:VIEWED]-(address)
    FOREACH (o IN CASE WHEN EXISTS(viewed.dateTimeCreated) THEN [] ELSE [viewed] END | SET viewed.dateTimeCreated = timestamp() )
)
SET user.views = SIZE(()-[:VIEWED]->(user))

RETURN user { 
    uId: user.uId,
    username: user.username,
    isVerified: user.isVerified,
    bio: user.bio,
    avatar: collect(properties(avatars))[0],
    haveItems: exists((user)-[:HAS_ITEM]->(:Item))
}
`