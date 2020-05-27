export const data = `
MATCH (:User { id: $userId })-[rel:PAYED]->(payments:Payment)
RETURN properties(payments) as payments
`