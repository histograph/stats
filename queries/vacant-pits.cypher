MATCH (p:`_VACANT`)
RETURN DISTINCT p.id AS id
LIMIT 1000