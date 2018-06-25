export const data = `
OPTIONAL MATCH (news:Newsletter)
WHERE {email} IN news.emails

FOREACH (o IN CASE WHEN news IS NULL THEN [1] ELSE [] END |
    MERGE (newsEmail:Newsletter)    
    SET newsEmail.emails = (CASE WHEN exists(newsEmail.emails) = false THEN [] ELSE newsEmail.emails END) + {email}
)
`