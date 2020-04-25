export const data = `
MATCH (user:User)
// TODO: this could potentially return multiple results
WHERE toLower(user.username) = toLower($emailOrUsername) OR toLower(user.email) = toLower($emailOrUsername)
RETURN user
{ 
    id: user.id,
    email: user.email,
    username: user.username,
    passwordHash: user.passwordHash,
    twoFactorAuthenticationEnabled: user.twoFactorAuthenticationEnabled,
    twoFactorAuthenticationSecret: user.twoFactorAuthenticationSecret,
    consent: user.consent,
    darkTheme: user.darkTheme,
    language: user.language
}
`