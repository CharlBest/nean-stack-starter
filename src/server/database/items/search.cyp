export const data = `
WITH 'title:' + $term + '~^2 ' + 'description:' + $term + '~'  as query
CALL db.index.fulltext.queryNodes('itemTitleAndDescriptionIndex', query) YIELD node as items

WITH collect(items) as itemList

// Save search
OPTIONAL MATCH (user:User { id: $userId })
FOREACH (o IN CASE WHEN user IS NOT NULL THEN [1] ELSE [] END |
    CREATE (user)-[:SEARCHED]->(:Searched { term: $term, dateCreated: datetime() })
)

WITH itemList
UNWIND itemList as items

MATCH (users:User)-[:HAS_ITEM]->(items)

OPTIONAL MATCH (:User { id: $userId })-[favourite:HAS_FAVOURITE]->(items)
OPTIONAL MATCH (:User { id: $userId })-[subscribed:SUBSCRIBED]->(items)
OPTIONAL MATCH (items)-[:HAS_FILE]->(files:File)
OPTIONAL MATCH (items)-[:TAG]->(tags:Tag)
OPTIONAL MATCH (users)-[:HAS_AVATAR]->(avatars:File)

RETURN properties(items) as items,
collect(properties(files)) as files,
collect(tags.name) as tags,
users
{
    id: users.id,
    username: users.username,
    avatar: collect(properties(avatars))[0]
},
CASE WHEN favourite IS NOT NULL THEN true ELSE false END as favourite,
CASE WHEN subscribed IS NOT NULL THEN true ELSE false END as subscribed

SKIP $pageIndex*$pageSize
LIMIT $pageSize
`