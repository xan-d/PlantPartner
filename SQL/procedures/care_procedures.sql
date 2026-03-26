-- ###################################
--          CARE CONTROLLER
-- ###################################

-- Procedures in this file:
--   GetCareLink     - Get care link for a plant by plantID

-- ==================== Procedures Start ====================

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
