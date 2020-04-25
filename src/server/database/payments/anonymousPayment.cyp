export const data = `
CREATE (payment:Payment { paymentUId: $paymentUId, amount: $amount, email: $email, chargeId: $chargeId, chargeCreated: $chargeCreated, dateCreated: timestamp() })
`