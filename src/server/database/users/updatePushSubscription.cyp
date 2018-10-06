export const data = `
MATCH (user:User { id: {userId} })
SET user.pushSubscription = [{pnEndpoint}, {pnKeysAuth}, {pnKeysEncrypt}]
`