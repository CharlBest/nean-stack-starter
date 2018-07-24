export const data = `
MATCH (user:User)
// TODO: this could potentially return multiple results
WHERE toLower(user.username) = toLower({emailOrUsername}) OR toLower(user.email) = toLower({emailOrUsername})
RETURN user
{ 
    id: user.id,
    uId: user.uId,
    email: user.email,
    username: user.username,
    password: user.password,
    passwordSalt: user.passwordSalt,
    emailCode: user.emailCode,
    stripeCustomerId: user.stripeCustomerId
}
`