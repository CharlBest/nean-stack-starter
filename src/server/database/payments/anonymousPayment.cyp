export const data = `
CREATE (payment:Payment { paymentUId: {paymentUId}, amount: {amount}, chargeId: {chargeId}, chargeCreated: {chargeCreated}, dateCreated: timestamp() })
`