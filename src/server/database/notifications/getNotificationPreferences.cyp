export const data = `
MATCH (user:User { id: {userId} })

RETURN
CASE WHEN user.pushSubscription IS NOT NULL THEN true ELSE false END as hasPushSubscription,
user.pushNotificationEnabled as pushNotificationEnabled,
user.emailEnabled as emailEnabled,
user.pushNotificationTypes as pushNotificationTypes,
user.emailNotificationTypes as emailNotificationTypes,
user.autoSubscribeToItem as autoSubscribeToItem
`