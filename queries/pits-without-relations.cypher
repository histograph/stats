START
  p=node(*)
MATCH
  (p:PIT)
WHERE
  not(p-[]->())
RETURN
  p
