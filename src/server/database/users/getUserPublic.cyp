export const data = `
MATCH (user:User { id: {userId} })
OPTIONAL MATCH (user)-[:HAS_ITEM]->(items: Item)
RETURN user { 
    uId: user.uId,
    username: user.username,
    isVerified: user.isVerified,
    bio: user.bio,
    avatarUrl: user.avatarUrl
}, collect(items) as items
`