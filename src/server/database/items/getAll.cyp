export const data = `
MATCH (items:Item)

RETURN items,
CASE WHEN (:User { id: {userId} })-[:HAS_ITEM]->(items) THEN true ELSE false END as canEdit

ORDER BY items.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`