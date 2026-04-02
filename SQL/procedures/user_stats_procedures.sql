-- ###################################
--          USER STATS CONTROLLER
-- ###################################

-- Procedures in this file:
--   GetUserStats            - Get timesWatered, inspectionDueDate, and notifyTime for a user
--   UpdateInspectionDueDate - Update inspectionDueDate for a user
--   UpdateNotifyTime        - Update notify_time for a user

-- ==================== Procedures Start ====================

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
