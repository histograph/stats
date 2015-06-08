MATCH
  (p1:PIT)-[r:SAMEHGCONCEPT]-(p2:PIT)
WHERE
  p1.sourceid <> p2.sourceid
RETURN DISTINCT
  p1.sourceid, p2.sourceid, p1.type, p2.type
