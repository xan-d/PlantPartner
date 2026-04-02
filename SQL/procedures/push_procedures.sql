-- ###################################
--          PUSH CONTROLLER
-- ###################################

-- Procedures in this file:
--   DeletePushSubscriptionByEndpoint - Delete push subscription by endpoint
--   AddPushSubscription             - Add a new push subscription
--   GetPlantsNeedingWater           - Get plants that need watering (for notifications)
--   GetPushSubscriptionsByUserID    - Get all push subscriptions for a user
--   DeletePushSubscriptionByID      - Delete push subscription by ID

-- ==================== Procedures Start ====================

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
