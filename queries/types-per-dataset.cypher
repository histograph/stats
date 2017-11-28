MATCH
  (p:_)
WHERE NOT p:_Rel AND NOT p:`=`
RETURN 
  p.dataset AS dataset,
  p.type AS type,
  COUNT(p) AS count