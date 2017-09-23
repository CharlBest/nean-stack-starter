export const data = `
MATCH (user:User)
// TODO: this could potentially return multiple results
WHERE toLower(user.username) = toLower({emailOrUsername}) OR toLower(user.email) = toLower({emailOrUsername})
RETURN user
`