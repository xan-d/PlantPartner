-- ###################################
--          AUTH CONTROLLER
-- ###################################

-- Procedures in this file:
--   GetUser         - Get userID by email
--   CreateUser      - Create a new user with email, password hash, and display name

-- ==================== Procedures Start ====================

-- ========================
-- Get User (by email)
-- ========================
DROP PROCEDURE IF EXISTS GetUser;
DELIMITER //

CREATE PROCEDURE GetUser(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT userID
     FROM Users 
     WHERE email = p_email;
END //

DELIMITER ;

-- =========================
-- Create User
-- =========================
DROP PROCEDURE IF EXISTS CreateUser;
DELIMITER //

CREATE PROCEDURE CreateUser(
    IN p_email VARCHAR(255),
    IN p_passwordHash VARCHAR(255),
    IN p_displayName VARCHAR(255)
)
BEGIN
    INSERT INTO Users (email, passwordHash, displayName) 
     VALUES (p_email , p_passwordHash, p_displayName);
END //

DELIMITER ;
