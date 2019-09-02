export const data = `
MATCH (user:User { id: {userId} })
SET user.passwordHash = {passwordHash}
RETURN user
{ 
    email: user.email
}
`