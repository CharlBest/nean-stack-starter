export const data = `
MATCH (:User { id: $userId })-[:PAYED]->(payments:Payment)
RETURN properties(payments) as payments
`