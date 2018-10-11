export const data = `
MATCH (user:User { id: {userId} })-[:HAS_ITEM]->(item:Item { uId: {uId} })
DETACH DELETE item

SET user.itemCount = SIZE((user)-[:HAS_ITEM]->())
`