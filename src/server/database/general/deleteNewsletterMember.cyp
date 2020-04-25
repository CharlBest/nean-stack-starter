export const data = `
MATCH (news:Newsletter)
WHERE EXISTS(news.emails)
SET news.emails = FILTER(x IN news.emails WHERE x <> $email)
`