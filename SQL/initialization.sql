-- Plant Partner Database
-- Author: Xander Deno
-- Description: Initial set up and example data for plants
SET
    FOREIGN_KEY_CHECKS = 0;

SET
    AUTOCOMMIT = 0;

-- Drop tables if they already exist
DROP TABLE IF EXISTS Plants;

--
-- Plants table
--
CREATE TABLE
    Plants (
        plantID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        scientific VARCHAR(255) NOT NULL UNIQUE,
        image VARCHAR(255),
        room VARCHAR(255),
        light VARCHAR(100),
        lastWatered INT,
        waterFreq INT,
        lastFed INT,
        health VARCHAR(50),
        careLink VARCHAR(500),
        color VARCHAR(7)
    ) ENGINE = InnoDB;

-- --------------------------------------------------------------
-- Example data
-- --------------------------------------------------------------
INSERT INTO
    Plants (
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
VALUES
    (
        'Golden Pothos',
        'Epipremnum aureum',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Game Room',
        'Indirect',
        2,
        10,
        14,
        'happy',
        'https://gardenish.co/plants/epipremnum-aureum',
        '#4a7c59'
    ),
    (
        'Monstera',
        'Monstera deliciosa',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Living Room',
        'Indirect',
        5,
        7,
        30,
        'happy',
        'https://gardenish.co/plants/monstera-deliciosa',
        '#3d6b4f'
    ),
    (
        'Snake Plant',
        'Sansevieria trifasciata',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Bedroom',
        'Low',
        10,
        14,
        60,
        'happy',
        'https://gardenish.co/plants/sansevieria-trifasciata',
        '#4a6b3a'
    ),
    (
        'Fiddle Leaf Fig',
        'Ficus lyrata',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Office',
        'Bright',
        3,
        7,
        30,
        'okay',
        'https://gardenish.co/plants/ficus-lyrata',
        '#7c6a4a'
    ),
    (
        'Peace Lily',
        'Spathiphyllum wallisii',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Bathroom',
        'Low',
        2,
        7,
        21,
        'happy',
        'https://gardenish.co/plants/spathiphyllum-wallisii',
        '#4a7a6b'
    ),
    (
        'Rubber Plant',
        'Ficus elastica',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Living Room',
        'Bright',
        6,
        10,
        45,
        'okay',
        'https://gardenish.co/plants/ficus-elastica',
        '#6b4a4a'
    ),
    (
        'ZZ Plant',
        'Zamioculcas zamiifolia',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Office',
        'Low',
        12,
        14,
        60,
        'happy',
        'https://gardenish.co/plants/zamioculcas-zamiifolia',
        '#556b4a'
    ),
    (
        'Spider Plant',
        'Chlorophytum comosum',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Kitchen',
        'Indirect',
        3,
        7,
        21,
        'happy',
        'https://gardenish.co/plants/chlorophytum-comosum',
        '#6b7a3a'
    ),
    (
        'Aloe Vera',
        'Aloe barbadensis',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Windowsill',
        'Bright',
        14,
        21,
        90,
        'happy',
        'https://gardenish.co/plants/aloe-barbadensis',
        '#7a8a4a'
    );

SET
    FOREIGN_KEY_CHECKS = 1;

COMMIT;