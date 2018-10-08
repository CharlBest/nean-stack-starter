export const data = `
MATCH (user:User { id: {userId} })
SET user.nt1 = {nt1}
SET user.nt2 = {nt2}
`