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

-- TODO: ensure update plant doesn't need an ID passed in

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



-- delete plant by id

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

-- get image by plantID & userID

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

-- update lastwatered by plantID & userID

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

-- update times watered by userID

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

/*
pushController
*/

-- ###################################
--          PUSH CONTROLLER
-- ###################################

-- ===========================
-- Delete Push Subscription (by endpoint)
-- ===========================
DROP PROCEDURE IF EXISTS DeletePushSubscriptionByEndpoint;
DELIMITER //

CREATE PROCEDURE DeletePushSubscriptionByEndpoint(
    IN p_endpoint VARCHAR(255)
)
BEGIN
    DELETE FROM push_subscriptions WHERE endpoint = p_endpoint;
END //

DELIMITER ;

-- ===========================
-- Add Push Subscription
-- ===========================
DROP PROCEDURE IF EXISTS AddPushSubscription;
DELIMITER //

CREATE PROCEDURE AddPushSubscription(
    IN p_user_id INT,
    IN p_endpoint VARCHAR(255),
    IN p_p256dh VARCHAR(255),
    IN p_auth VARCHAR(255)
)
BEGIN
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (p_user_id, p_endpoint, p_p256dh, p_auth);
END //

DELIMITER ;

-- ===========================
-- Get Plants Needing Water (for notifications)
-- ===========================
DROP PROCEDURE IF EXISTS GetPlantsNeedingWater;
DELIMITER //

CREATE PROCEDURE GetPlantsNeedingWater()
BEGIN
    SELECT p.name, p.userID as user_id FROM Plants p WHERE DATE_ADD(p.lastWatered, INTERVAL p.waterFreq DAY) <= CURDATE();
END //

DELIMITER ;

-- ===========================
-- Get Push Subscriptions (by userID)
-- ===========================
DROP PROCEDURE IF EXISTS GetPushSubscriptionsByUserID;
DELIMITER //

CREATE PROCEDURE GetPushSubscriptionsByUserID(
    IN p_user_id INT
)
BEGIN
    SELECT * FROM push_subscriptions WHERE user_id = p_user_id;
END //

DELIMITER ;

-- ===========================
-- Delete Push Subscription (by id)
-- ===========================
DROP PROCEDURE IF EXISTS DeletePushSubscriptionByID;
DELIMITER //

CREATE PROCEDURE DeletePushSubscriptionByID(
    IN p_id INT
)
BEGIN
    DELETE FROM push_subscriptions WHERE id = p_id;
END //

DELIMITER ;

/*
userStatsController
*/

-- ###################################
--          USER STATS CONTROLLER
-- ###################################

-- ===========================
-- Get User Stats (by userID)
-- ===========================
DROP PROCEDURE IF EXISTS GetUserStats;
DELIMITER //

CREATE PROCEDURE GetUserStats(
    IN p_userID INT
)
BEGIN
    SELECT timesWatered, inspectionDueDate, notify_time AS notifyTime FROM Users WHERE userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Update Inspection Due Date (by userID)
-- ===========================
DROP PROCEDURE IF EXISTS UpdateInspectionDueDate;
DELIMITER //

CREATE PROCEDURE UpdateInspectionDueDate(
    IN p_userID INT,
    IN p_inspectionDueDate DATE
)
BEGIN
    UPDATE Users SET inspectionDueDate = p_inspectionDueDate WHERE userID = p_userID;
END //

DELIMITER ;

-- ===========================
-- Update Notify Time (by userID)
-- ===========================
DROP PROCEDURE IF EXISTS UpdateNotifyTime;
DELIMITER //

CREATE PROCEDURE UpdateNotifyTime(
    IN p_userID INT,
    IN p_notifyTime TIME
)
BEGIN
    UPDATE Users SET notify_time = p_notifyTime WHERE userID = p_userID;
END //

DELIMITER ;

-- 


