export const data = `
MATCH (user:User { id: {userId} })

FOREACH (o IN CASE WHEN {stripeCustomerId} IS NOT NULL THEN [1] ELSE [] END |
    SET user.stripeCustomerId = {stripeCustomerId}
)

WITH user

OPTIONAL MATCH (card:Card { stripeFingerprint: {stripeFingerprint} })
FOREACH (o IN CASE WHEN card IS NULL THEN [1] ELSE [] END |
    CREATE (card:Card { uId: {uId}, stripeCardId: {stripeCardId}, stripeFingerprint: {stripeFingerprint}, brand: {brand}, last4: {last4}, dateCreated: timestamp(), isDefault: false })
)
WITH user
MATCH (card:Card { stripeFingerprint: {stripeFingerprint} })

WITH user, card

OPTIONAL MATCH (user)-[:HAS_CARD]->(cards: Card)

FOREACH (o IN CASE WHEN cards IS NULL THEN [1] ELSE [] END |
    SET card.isDefault = true
)

MERGE (user)-[:HAS_CARD]->(card)

RETURN card
`