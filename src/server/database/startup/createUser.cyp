export const data = `
CREATE USER $username IF NOT EXISTS
SET PASSWORD '$password' CHANGE NOT REQUIRED
`