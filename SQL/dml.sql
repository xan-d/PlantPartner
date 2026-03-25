-- 
-- TODO:
-- pull dog_haven for plsql ref
-- grab ss of push subs, users, and sessions (for repeated notifs)
-- 


-- ###################################
--          AUTH CONTROLLER
-- ###################################

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


-- ###################################
--          CARE CONTROLLER
-- ###################################

-- ===========================
-- Get Care Link (by plantID)
-- ===========================
DROP PROCEDURE IF EXISTS GetCareLink;
DELIMITER //

CREATE PROCEDURE GetCareLink(
    IN p_plantID INT
)
BEGIN
    SELECT careLink 
     FROM Plants 
     WHERE plantID = p_plantID;
END //

DELIMITER ;

-- ###################################
--         PLANT CARD CONTROLLER
-- ###################################

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
-- Get Plant (by plantID)
-- ===========================
DROP IF PROCEDURE EXISTS GetPlantById;
DELIMITER //

CREATE PROCEDURE GetPlantById(
    IN p_plantID INT,
    IN p_userID INT
)
BEGIN
    SELECT *, DATEDIFF(CURDATE(), lastWatered) AS daysSinceWatered 
     FROM Plants 
     WHERE plantID = ? AND userID = ?
END //

DELIMITER ;

-- ===========================
-- Create Plant
-- ===========================
DROP IF PROCEDURE EXISTS CreatePlant;
DELIMITER //

CREATE PROCEDURE CreatePlant(
    IN p_userID INT,
    IN p_name VARCHAR(255)
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
     )
END //

DELIMITER ;

-- TODO: ensure update plant doesn't need an ID passed in

-- ===========================
-- Update Plant (by id)
-- ===========================
DROP PROCEDURE IF EXISTS UpdatePlant;
DELIMITER //

CREATE PROCEDURE UpdatePlant(
    IN p_name VARCHAR(255)
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
    SET name=?,
        scientific=?,
        room=?,
        light=?,
        lastWatered=?,
        waterFreq=?,
        lastFed=?,
        health=?,
        careLink=?,
        color=?
END //

DELIMITER ;

-- delete plant by id
DELETE FROM Plants WHERE plantID=? AND userID=?

-- get image by plantID & userID
SELECT image FROM Plants WHERE plantID=? AND userID=?

-- update lastwatered by plantID & userID
UPDATE Plants SET lastWatered = CURDATE() WHERE plantID = ? AND userID = ?

-- update times watered by userID
UPDATE Users SET timesWatered = timesWatered + 1 WHERE userID = ?

/*
pushController
*/
-- delete subscribtions by endpoint
DELETE FROM push_subscriptions WHERE endpoint = ?, [endpoint]

-- add push subscription
INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (?,?,?,?)

-- get plant name & userID
 SELECT p.name, p.userID as user_id FROM Plants p WHERE DATE_ADD(p.lastWatered, INTERVAL p.waterFreq DAY) <= CURDATE()

-- get push subscription by userID
SELECT * FROM push_subscriptions WHERE user_id = ? [userID]

-- delete push sub by id
DELETE FROM push_subscriptions WHERE id = ? [sub.id]

/*
userStatsController
*/
-- get timesWatered, inspectionDueDate, and notify_time by userID
SELECT timesWatered, inspectionDueDate, notify_time AS notifyTime FROM Users WHERE userID = ?

-- update timesWatered by userID
UPDATE Users SET timesWatered = timesWatered + 1 WHERE userID = ?

-- update inspectionDueDate by userID
UPDATE Users SET inspectionDueDate = ? WHERE userID = ?

-- update notifytime by userID
UPDATE Users SET notify_time = ? WHERE userID = ?

-- 


