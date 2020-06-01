export const data = `
CREATE (payment:Payment { amount: $amount, email: $email, chargeId: $chargeId, chargeCreated: $chargeCreated, dateCreated: datetime() })
`