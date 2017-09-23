export const data = `
OPTIONAL MATCH (user:User { id: {userId}, emailCode: {code} })
SET user.emailVerified = true
RETURN CASE WHEN user IS NULL THEN false ELSE true END as userExist
`