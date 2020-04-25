export const data = `
MATCH (user:User { id: $userId })-[:HAS_CARD]->(card:Card { uId: $cardUId })

MATCH (user)-[:HAS_CARD]->(cards: Card)

SET cards.isDefault = false
SET card.isDefault = true

RETURN DISTINCT card
`