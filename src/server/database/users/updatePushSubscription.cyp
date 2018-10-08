export const data = `
MATCH (user:User { id: {userId} })
SET user.pushSubscription = {pushSubscription}

FOREACH (o IN CASE WHEN user.nt1 IS NULL THEN [1] ELSE [] END |
    SET user.nt1 = true
)

FOREACH (o IN CASE WHEN user.nt2 IS NULL THEN [1] ELSE [] END |
    SET user.nt2 = true
)
`