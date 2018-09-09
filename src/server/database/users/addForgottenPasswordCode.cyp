export const data = `
MATCH (user:User)
WHERE toLower(user.email) = toLower({email})
SET user.forgotPasswordCodes = CASE WHEN user.forgotPasswordCodes IS NULL THEN [] ELSE user.forgotPasswordCodes END + [{code}]
RETURN user
{ 
    email: user.email
}
`