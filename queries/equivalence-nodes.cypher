MATCH (c:`=`)
OPTIONAL MATCH (c) --> (n)
WITH id(c) AS neo_id, count(DISTINCT n) AS size, collect(DISTINCT n.name) AS names
RETURN neo_id, size, names ORDER BY size DESC LIMIT 25;
