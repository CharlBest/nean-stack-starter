export const data = `
CALL db.index.fulltext.createNodeIndex('userEmailAndUsernameIndex', ['User'], ['email', 'username'], {analyzer: 'standard'})
`