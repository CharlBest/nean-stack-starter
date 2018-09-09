export const data = `
MATCH (user:User { id: {userId} })
SET user.password = {password}, user.passwordSalt = {passwordSalt}
RETURN user
{ 
    email: user.email
}
`