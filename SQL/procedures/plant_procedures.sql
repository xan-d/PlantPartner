-- ###################################
--         PLANT CARD CONTROLLER
-- ###################################

-- Procedures in this file:
--   GetAllPlants        - Get all plants for a user, ordered by days since watered
--   GetPlantById        - Get plant details by plantID and userID
--   CreatePlant         - Add a new plant for a user
--   UpdatePlant         - Update plant details by plantID and userID
--   DeletePlant         - Delete a plant by plantID and userID
--   GetPlantImage       - Get image filename for a plant by plantID and userID
--   UpdateLastWatered   - Set lastWatered to today for a plant
--   IncrementTimesWatered - Increment timesWatered for a user

-- ==================== Procedures Start ====================

-- ======================================
-- Get All Plants (returns ordered list)
-- ======================================
DROP PROCEDURE IF EXISTS GetAllPlants;
DELIMITER //

CREATE PROCEDURE GetAllPlants(
    IN p_userID VARCHAR(255)
)
BEGIN
    SELECT *, DATEDIFF(CURDATE(), lastWatered) AS daysSinceWatered 
     FROM Plants 
    WHERE userID = p_userID
    ORDER BY daysSinceWatered DESC;
END //

DELIMITER;

-- ===========================
DROP PROCEDURE IF EXISTS GetPlantById;
DELIMITER //

CREATE PROCEDURE GetPlantById(
    IN p_plantID INT,
    IN p_userID INT
)
BEGIN
    SELECT *, DATEDIFF(CURDATE(), lastWatered) AS daysSinceWatered 
     FROM Plants 
     WHERE plantID = p_plantID AND userID = p_userID;
END //

DELIMITER ;

-- ===========================
DROP PROCEDURE IF EXISTS CreatePlant;
DELIMITER //

CREATE PROCEDURE CreatePlant(
    IN p_userID INT,
    IN p_name VARCHAR(255),
    IN p_scientific VARCHAR(255),
    IN p_image VARCHAR(255),
    IN p_room VARCHAR(255),
    IN p_light VARCHAR(100),
    IN p_lastWatered DATE,
    IN p_waterFreq INT,
    IN p_lastFed DATE,
    IN p_health VARCHAR(50),
    IN p_careLink VARCHAR(500),
    IN p_color VARCHAR(7)
)
BEGIN
    INSERT INTO Plants (
        userID,
        name,
        scientific,
        image,
        room,
        light,
        lastWatered,
        waterFreq,
        lastFed,
        health,
        careLink,
        color
    ) 
    VALUES (
        p_userID,
        p_name,
        p_scientific,
        p_image,
        p_room,
        p_light,
        p_lastWatered,
        p_waterFreq,
        p_lastFed,
        p_health,
        p_careLink,
        p_color
    );
END //

DELIMITER ;

-- ===========================
DROP PROCEDURE IF EXISTS UpdatePlant;
DELIMITER //

CREATE PROCEDURE UpdatePlant(
    IN p_plantID INT,
    IN p_userID INT,
    IN p_name VARCHAR(255),
    IN p_scientific VARCHAR(255),
    IN p_image VARCHAR(255),
    IN p_room VARCHAR(255),
    IN p_light VARCHAR(100),
    IN p_lastWatered DATE,
    IN p_waterFreq INT,
    IN p_lastFed DATE,
    IN p_health VARCHAR(50),
    IN p_careLink VARCHAR(500),
    IN p_color VARCHAR(7)
)
BEGIN
    UPDATE Plants 
    SET name = p_name,
        scientific = p_scientific,
        image = p_image,
        room = p_room,
        light = p_light,
        lastWatered = p_lastWatered,
        waterFreq = p_waterFreq,
        lastFed = p_lastFed,
        health = p_health,
        careLink = p_careLink,
        color = p_color
    WHERE plantID = p_plantID AND userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Delete Plant (by plantID & userID)
-- ===========================
DROP PROCEDURE IF EXISTS DeletePlant;
DELIMITER //

CREATE PROCEDURE DeletePlant(
    IN p_plantID INT,
    IN p_userID INT
)
BEGIN
    DELETE FROM Plants WHERE plantID = p_plantID AND userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Get Plant Image (by plantID & userID)
-- ===========================
DROP PROCEDURE IF EXISTS GetPlantImage;
DELIMITER //

CREATE PROCEDURE GetPlantImage(
    IN p_plantID INT,
    IN p_userID INT
)
BEGIN
    SELECT image FROM Plants WHERE plantID = p_plantID AND userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Update LastWatered (by plantID & userID)
-- ===========================
DROP PROCEDURE IF EXISTS UpdateLastWatered;
DELIMITER //

CREATE PROCEDURE UpdateLastWatered(
    IN p_plantID INT,
    IN p_userID INT
)
BEGIN
    UPDATE Plants SET lastWatered = CURDATE() WHERE plantID = p_plantID AND userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Increment TimesWatered (by userID)
-- ===========================
DROP PROCEDURE IF EXISTS IncrementTimesWatered;
DELIMITER //

CREATE PROCEDURE IncrementTimesWatered(
    IN p_userID INT
)
BEGIN
    UPDATE Users SET timesWatered = timesWatered + 1 WHERE userID = p_userID;
END //

DELIMITER ;
