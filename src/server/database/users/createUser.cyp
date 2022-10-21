export const data = `
//Auto increment user ids
OPTIONAL MATCH (nextUser:User)
WITH nextUser, CASE WHEN nextUser IS NULL THEN 1 ELSE nextUser.id + 1 END as nextId
ORDER BY nextUser.id DESC
LIMIT 1

MERGE (user:User { email: $email, username: $username })
ON CREATE
    SET user.id = nextId
    SET user.uId = $uId
    SET user.passwordHash = $passwordHash
    SET user.dateCreated = datetime()
    SET user.isVerified = false
    SET user.views = 0
    SET user.bio = ''
    SET user.emailCode = $emailCode
    SET user.emailVerified = false

RETURN user
{ 
    email: user.email,
    username: user.username,
    emailCode: user.emailCode
}
`