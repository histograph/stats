MATCH
  (p:_)
WHERE NOT p:_Rel AND NOT p:`=` AND NOT p:`=i`
RETURN DISTINCT
  p.dataset AS dataset, p.type AS type, COUNT(p) AS count
