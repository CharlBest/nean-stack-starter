export const data = `
MATCH (user:User { id: {userId}, emailCode: {code} })
SET user.emailVerified = true
SET user.emailVerifiedDateCreated = CASE WHEN user.emailVerifiedDateCreated IS NULL THEN timestamp() ELSE user.emailVerifiedDateCreated END
RETURN CASE WHEN user IS NULL THEN false ELSE true END as userExist
`