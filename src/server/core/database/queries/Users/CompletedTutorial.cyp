export const data = `
MERGE (tutorial:Tutorial { type: {tutorialType} })
MERGE (:User { id: {userId} })-[:COMPLETED]-(tutorial)
`

//ADD skip relationship
//ADD date when completed/skipped