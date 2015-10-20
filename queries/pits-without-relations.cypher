MATCH
  (p:_)
WHERE
  not(p-[]->())
  AND NOT p:_Rel AND NOT p:`=` AND NOT p:`=i`
RETURN
  p.name AS name, p.uri AS uri, p.id AS id
LIMIT 500
