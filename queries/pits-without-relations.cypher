MATCH
  (p:_)
WHERE
  not(p-[]->())
  AND NOT p:_Rel AND NOT p:`=` AND NOT p:`=i`
RETURN
  p
