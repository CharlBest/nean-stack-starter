export const data = `
OPTIONAL MATCH (user:User { id: {userId} })
WITH DISTINCT CASE WHEN user IS NOT NULL OR {id} = {userId} THEN true ELSE false END AS HasUserAtRoot
RETURN HasUserAtRoot
`