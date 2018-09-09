export const data = `
MATCH (user:User { email: {email} })
WHERE {code} IN user.forgotPasswordCodes
SET user.forgotPasswordCodes = [], user.password = {password}, user.passwordSalt = {passwordSalt}
RETURN user
{
    email: user.email
}
`