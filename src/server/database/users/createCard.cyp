export const data = `
MATCH (user:User { id: {userId} })

FOREACH (o IN CASE WHEN {stripeCustomerId} IS NOT NULL THEN [1] ELSE [] END |
    SET user.stripeCustomerId = {stripeCustomerId}
)

CREATE (card:Card { uId: {uId}, stripeCardId: {stripeCardId}, last4: {last4}, dateCreated: timestamp(), isDefault: false })

WITH user, card

OPTIONAL MATCH (user)-[:HAS_CARD]->(cards: Card)

FOREACH (o IN CASE WHEN cards IS NULL THEN [1] ELSE [] END |
    SET card.isDefault = true
)

MERGE (user)-[:HAS_CARD]->(card)

RETURN card
`