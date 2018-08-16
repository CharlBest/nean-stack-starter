export const data = `
MATCH (items:Item)
RETURN items

ORDER BY items.dateCreated DESC
SKIP {pageIndex}*{pageSize}
LIMIT {pageSize}
`