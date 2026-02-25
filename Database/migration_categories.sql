USE talastock_db;

-- Add Categories table if not exists
CREATE TABLE IF NOT EXISTS Categories (
    CategoryId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

-- Add CategoryId column to Items if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'Items';
SET @columnname = 'CategoryId';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname
     AND TABLE_NAME = @tablename
     AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  'ALTER TABLE Items ADD COLUMN CategoryId INT, ADD FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId) ON DELETE SET NULL'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Seed Categories
INSERT IGNORE INTO Categories (Name) VALUES ('Electronics'), ('Office Supplies'), ('Furniture'), ('Accessories');

-- Assign random categories to all items
UPDATE Items 
SET CategoryId = (SELECT CategoryId FROM Categories ORDER BY RAND() LIMIT 1)
WHERE CategoryId IS NULL;
