MATCH (p:_) WHERE NOT p:`=`
WITH collect(DISTINCT p.dataset) AS ds LIMIT 1
UNWIND ds AS d
OPTIONAL MATCH (n:_ {dataset: d}) WHERE NOT n:`=` AND NOT n:`_Rel`
WITH d, count(distinct n) AS pits
OPTIONAL MATCH (r:_ {dataset: d}) WHERE NOT r:`=` AND r:`_Rel`
RETURN d AS dataset, pits, count(distinct r) AS relations
ORDER BY pits DESC
