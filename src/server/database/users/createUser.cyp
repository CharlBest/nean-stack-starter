export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextUser:User)
WITH nextUser, CASE WHEN nextUser IS NULL THEN 1 ELSE nextUser.id + 1 END as nextId
ORDER BY nextUser.id DESC
LIMIT 1

CREATE (user:User { id: nextId, uId: $uId, email: $email, username: $username, passwordHash: $passwordHash, dateCreated: datetime(), isVerified: false, views: 0, bio: '', emailCode: $emailCode, emailVerified: false })

RETURN user
{ 
    email: user.email,
    username: user.username,
    emailCode: user.emailCode
}
`