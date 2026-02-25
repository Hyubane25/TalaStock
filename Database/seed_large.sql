USE talastock_db;

DROP PROCEDURE IF EXISTS GenerateDummyItems;

DELIMITER //
CREATE PROCEDURE GenerateDummyItems()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_qty INT;
    DECLARE random_price DECIMAL(10,2);
    
    WHILE i <= 1000 DO
        SET random_qty = FLOOR(RAND() * 500);
        SET random_price = ROUND(10 + (RAND() * 2000), 2);
        
        INSERT INTO Items (Name, Description, Quantity, Price)
        VALUES (
            CONCAT('Item #', i),
            CONCAT('Premium description for item number ', i, '. High quality inventory stock record.'),
            random_qty,
            random_price
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL GenerateDummyItems();
DROP PROCEDURE GenerateDummyItems;
