MATCH
  (p1:_)-[:`hg:sameHgConcept`]-()-[:`hg:sameHgConcept`]-(p2:_)
WHERE
  p1.dataset <> p2.dataset
  AND NOT p1:_Rel AND NOT p1:`=` AND NOT p1:`=i`
  AND NOT p2:_Rel AND NOT p2:`=` AND NOT p2:`=i`
RETURN DISTINCT
  {dataset: p1.dataset, type: p1.type} AS p1, {dataset: p2.dataset, type: p2.type} AS p2
