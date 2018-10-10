export const data = `
MATCH (user:User { id: {userId} })

// Push Notification from false ---> true
FOREACH (o IN CASE WHEN (user.pushNotificationEnabled IS NULL OR user.pushNotificationEnabled = false) AND {pushNotificationEnabled} = true THEN [1] ELSE [] END |
    SET user.pushSubscription = {pushSubscription}
)

// Push Notification from true ---> false
FOREACH (o IN CASE WHEN (user.pushNotificationEnabled IS NULL OR user.pushNotificationEnabled = true) AND {pushNotificationEnabled} = false THEN [1] ELSE [] END |
    SET user.pushSubscription = null
)

// Email Notification from false ---> true
FOREACH (o IN CASE WHEN (user.emailEnabled IS NULL OR user.emailEnabled = false) AND {emailEnabled} = true THEN [1] ELSE [] END |
    SET user.pushSubscription = {pushSubscription}
)

// Email Notification from true ---> false
FOREACH (o IN CASE WHEN (user.emailEnabled IS NULL OR user.emailEnabled = true) AND {emailEnabled} = false THEN [1] ELSE [] END |
    SET user.pushSubscription = null
)

SET user.pushNotificationEnabled = {pushNotificationEnabled}
SET user.emailEnabled = {emailEnabled}

SET user.pushNotificationTypes = {pushNotificationTypes}
SET user.emailNotificationTypes = {emailNotificationTypes}
`