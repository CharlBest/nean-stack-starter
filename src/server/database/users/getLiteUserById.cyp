export const data = `
MATCH (user:User { id: $userId })
RETURN user 
{ 
    id: user.id,
    uId: user.uId,
    email: user.email,
    username: user.username,
    passwordHash: user.passwordHash,
    emailCode: user.emailCode,
    stripeCustomerId: user.stripeCustomerId
}
`