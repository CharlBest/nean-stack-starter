export const data = `
CREATE (payment:Payment { token: {token}, amount: {amount}, dateCreated: timestamp() })
`