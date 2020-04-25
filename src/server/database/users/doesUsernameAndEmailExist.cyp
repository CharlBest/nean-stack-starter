export const data = `
OPTIONAL MATCH (emailUser:User)
WHERE toLower(emailUser.email) = toLower($email)
OPTIONAL MATCH (idUser:User)
WHERE toLower(idUser.username) = toLower($username)
RETURN CASE WHEN emailUser.email IS NOT NULL THEN true ELSE false END as emailExist,
CASE WHEN idUser.username IS NOT NULL THEN true ELSE false END as usernameExist
`