MATCH
  (p:_)
WHERE
  NOT ( (p)-[]->() )
  AND NOT (p:_Rel) AND NOT (p:`=`)
RETURN
  p.name AS name, p.uri AS uri, p.id AS id
LIMIT 500