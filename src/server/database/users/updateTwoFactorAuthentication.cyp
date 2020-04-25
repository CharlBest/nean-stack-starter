export const data = `
MATCH (user:User { id: $userId })

SET user.twoFactorAuthenticationEnabled = $isEnabled
SET user.twoFactorAuthenticationSecret = CASE WHEN user.twoFactorAuthenticationSecret IS NULL THEN $generatedSecret ELSE user.twoFactorAuthenticationSecret END

RETURN user
{ 
    email: user.email,
    twoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret
}
`