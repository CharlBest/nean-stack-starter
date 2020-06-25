export const data = `
MATCH (user:User { id: $userId })-[hasFavourite:HAS_FAVOURITE]->(item:Item { uId: $uId })

SET user.favouriteCount = SIZE((user)-[:HAS_FAVOURITE]->())
SET item.favouriteCount = SIZE((item)<-[:HAS_FAVOURITE]-())

WITH user, item, hasFavourite

// Adjust rest of favourites order
OPTIONAL MATCH (user)-[moveDownRestUpRel:HAS_FAVOURITE]->(:Item)
WHERE moveDownRestUpRel.order <= user.favouriteCount AND moveDownRestUpRel.order >= hasFavourite.order + 1

SET moveDownRestUpRel.order = toInteger(moveDownRestUpRel.order - 1)

DELETE hasFavourite

RETURN item.uId
`