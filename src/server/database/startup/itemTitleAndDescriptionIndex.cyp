export const data = `
// To get all available analyzers (default: standard)
// CALL db.index.fulltext.listAvailableAnalyzers

CALL db.index.fulltext.createNodeIndex('itemTitleAndDescriptionIndex', ['Item'], ['title', 'description'], {analyzer: 'standard'})
`