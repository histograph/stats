MATCH
  (p1:_)-[r:`hg:liesIn`*2..2]->(p2:_)
WHERE
  p1.dataset = p2.dataset
  AND NOT p1:_Rel AND NOT p1:`=` AND NOT p1:`=i`
  AND NOT p2:_Rel AND NOT p2:`=` AND NOT p2:`=i`
RETURN DISTINCT
  p1.dataset AS dataset, p1.type AS from, p2.type AS to
