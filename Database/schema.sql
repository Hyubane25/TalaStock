-- TalaStock Database Schema
CREATE DATABASE IF NOT EXISTS talastock_db;
USE talastock_db;

-- Categories table
CREATE TABLE IF NOT EXISTS Categories (
    CategoryId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE
);

-- Roles table
CREATE TABLE IF NOT EXISTS Roles (
    RoleId INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    RoleId INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

-- Items table
CREATE TABLE IF NOT EXISTS Items (
    ItemId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Quantity INT DEFAULT 0,
    Price DECIMAL(18, 2) DEFAULT 0.00,
    CategoryId INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId) ON DELETE SET NULL
);

-- Seed Data
INSERT IGNORE INTO Categories (Name) VALUES ('Electronics'), ('Office Supplies'), ('Furniture'), ('Accessories');
INSERT IGNORE INTO Roles (RoleName) VALUES ('Admin'), ('User');

-- Default Admin (Password: Admin123!)
INSERT IGNORE INTO Users (Username, Email, PasswordHash, RoleId) 
VALUES ('admin', 'admin@talastock.com', '$2y$12$K7v19.j/6J4Q4I4J4J4J4OQ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', 1);

-- Currencies table
CREATE TABLE IF NOT EXISTS Currencies (
    CurrencyId INT AUTO_INCREMENT PRIMARY KEY,
    Symbol VARCHAR(5) NOT NULL,
    Code VARCHAR(3) NOT NULL UNIQUE,
    Name VARCHAR(50) NOT NULL,
    IsDefault BOOLEAN DEFAULT FALSE
);

-- Inventory History for Analytics
CREATE TABLE IF NOT EXISTS InventoryHistory (
    HistoryId INT AUTO_INCREMENT PRIMARY KEY,
    ItemId INT,
    ChangeQuantity INT,
    TotalQuantity INT,
    ChangeType ENUM('Add', 'Remove', 'Update', 'Initial') NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ItemId) REFERENCES Items(ItemId) ON DELETE CASCADE
);

-- Seed Data Update
INSERT IGNORE INTO Currencies (Symbol, Code, Name, IsDefault) 
VALUES ('$', 'USD', 'US Dollar', TRUE), 
       ('₱', 'PHP', 'Philippine Peso', FALSE),
       ('€', 'EUR', 'Euro', FALSE);

-- Trigger to track history automatically on Item update
DROP TRIGGER IF EXISTS tr_ItemStockUpdate;
DELIMITER //
CREATE TRIGGER tr_ItemStockUpdate
AFTER UPDATE ON Items
FOR EACH ROW
BEGIN
    IF OLD.Quantity <> NEW.Quantity THEN
        INSERT INTO InventoryHistory (ItemId, ChangeQuantity, TotalQuantity, ChangeType)
        VALUES (NEW.ItemId, NEW.Quantity - OLD.Quantity, NEW.Quantity, 'Update');
    END IF;
END //
DELIMITER ;

-- Trigger to track history on Item Insert
DROP TRIGGER IF EXISTS tr_ItemStockInsert;
DELIMITER //
CREATE TRIGGER tr_ItemStockInsert
AFTER INSERT ON Items
FOR EACH ROW
BEGIN
    INSERT INTO InventoryHistory (ItemId, ChangeQuantity, TotalQuantity, ChangeType)
    VALUES (NEW.ItemId, NEW.Quantity, NEW.Quantity, 'Initial');
END //
DELIMITER ;

