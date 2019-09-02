export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextUser:User)
WITH nextUser, CASE WHEN nextUser IS NULL THEN 1 ELSE nextUser.id + 1 END as nextId
ORDER BY nextUser.id DESC
LIMIT 1

CREATE (user:User { id: nextId, uId: {uId}, email: {email}, username: {username}, passwordHash: {passwordHash}, dateCreated: timestamp(), isVerified: false, views: 0, bio: '', avatarUrl: '', emailCode: {emailCode}, emailVerified: false })

//Temp fix for feed bacause first node needs to be included
MERGE (user)-[:IS]->(user)

RETURN user
{ 
    email: user.email,
    username: user.username,
    emailCode: user.emailCode
}
`