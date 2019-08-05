export const data = `
MATCH (user:User { id: {userId} })

// Get item that was moved to check if id and order is correct
MATCH (user)-[orderRel:HAS_FAVOURITE]->(:Item { uId: {uId} })

// Move item up and the rest down the chain
OPTIONAL MATCH (user)-[moveUpRestDownRel:HAS_FAVOURITE]->(:Item)
WHERE moveUpRestDownRel.order >= {newOrderVal} AND moveUpRestDownRel.order <= {originalOrderVal} - 1

FOREACH (o IN CASE WHEN {newOrderVal} < {originalOrderVal} THEN [1] ELSE [] END | SET moveUpRestDownRel.order = toInt(moveUpRestDownRel.order + 1) )

WITH user, orderRel

// Move item down and the rest up the chain
OPTIONAL MATCH (user)-[moveDownRestUpRel:HAS_FAVOURITE]->(:Item)
WHERE moveDownRestUpRel.order <= {newOrderVal} AND moveDownRestUpRel.order >= {originalOrderVal} + 1

FOREACH (o IN CASE WHEN {newOrderVal} > {originalOrderVal} THEN [1] ELSE [] END | SET moveDownRestUpRel.order = toInt(moveDownRestUpRel.order - 1) )

// Finally set the item that was moved to its position
SET orderRel.order = toInt({newOrderVal})
`