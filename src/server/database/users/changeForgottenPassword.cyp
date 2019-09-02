export const data = `
MATCH (user:User { email: {email} })
WHERE {code} IN user.forgotPasswordCodes
SET user.forgotPasswordCodes = [], user.passwordHash = {passwordHash}
RETURN user
{
    email: user.email
}
`