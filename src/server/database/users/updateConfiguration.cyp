export const data = `
MATCH (user:User { id: $userId })

SET user.consent = CASE WHEN $consent IS NOT NULL THEN $consent ELSE user.consent END
SET user.darkTheme = CASE WHEN $darkTheme IS NOT NULL THEN $darkTheme ELSE user.darkTheme END
SET user.language = CASE WHEN $language IS NOT NULL THEN $language ELSE user.language END
`