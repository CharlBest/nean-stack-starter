export const data = `
MATCH (item:Item { uId: {uId} })

RETURN item,
CASE WHEN (:User { id: {userId} })-[:HAS_ITEM]->(item) THEN true ELSE false END as canEdit
`