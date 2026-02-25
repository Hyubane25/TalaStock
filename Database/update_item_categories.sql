USE talastock_db;

-- Assign random categories to all items
UPDATE Items 
SET CategoryId = (SELECT CategoryId FROM Categories ORDER BY RAND() LIMIT 1)
WHERE CategoryId IS NULL;
