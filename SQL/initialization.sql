-- Plant Partner Database
-- Author: Xander Deno
-- Description: Initial set up and example data for plants
SET
    FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they already exist
DROP TABLE IF EXISTS Plants;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS push_subscriptions;

--
-- Push Notifs table
--
CREATE TABLE
    push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh TEXT NOT NULL,
        auth TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

--
-- Users table
--
CREATE TABLE
    Users (
        userID INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        displayName VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE = InnoDB;

--
-- Plants table
--
CREATE TABLE
    Plants (
        plantID INT AUTO_INCREMENT PRIMARY KEY,
        userID INT,
        name VARCHAR(255) NOT NULL,
        scientific VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        room VARCHAR(255),
        light VARCHAR(100),
        lastWatered DATE,
        waterFreq INT,
        lastFed DATE,
        health VARCHAR(50),
        careLink VARCHAR(500),
        color VARCHAR(7),
        FOREIGN KEY (userID) REFERENCES Users (userID)
    ) ENGINE = InnoDB;

-- --------------------------------------------------------------
-- Example data
-- --------------------------------------------------------------
-- Example user (password is "password123")
INSERT INTO
    Users (userID, email, passwordHash, displayName)
VALUES
    (
        1,
        'test@test.com',
        '$2b$12$gbc66kT1wytJUvV3z8tONuWN6IRaVv4sxuy2rupjRe7umCjNVnYQ2',
        'Xander'
    );

INSERT INTO
    Plants (
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
VALUES
    (
        1,
        'Golden Pothos',
        'Epipremnum aureum',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Game Room',
        'Indirect',
        '2026-03-03',
        10,
        '2026-02-19',
        'happy',
        'https://gardenish.co/plants/epipremnum-aureum',
        '#4a7c59'
    ),
    (
        1,
        'Monstera',
        'Monstera deliciosa',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Living Room',
        'Indirect',
        '2026-02-28',
        7,
        '2026-02-03',
        'happy',
        'https://gardenish.co/plants/monstera-deliciosa',
        '#3d6b4f'
    ),
    (
        1,
        'Snake Plant',
        'Sansevieria trifasciata',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Bedroom',
        'Low',
        '2026-02-23',
        14,
        '2026-01-04',
        'happy',
        'https://gardenish.co/plants/sansevieria-trifasciata',
        '#4a6b3a'
    ),
    (
        1,
        'Fiddle Leaf Fig',
        'Ficus lyrata',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Office',
        'Bright',
        '2026-03-02',
        7,
        '2026-02-03',
        'okay',
        'https://gardenish.co/plants/ficus-lyrata',
        '#7c6a4a'
    ),
    (
        1,
        'Peace Lily',
        'Spathiphyllum wallisii',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Bathroom',
        'Low',
        '2026-03-03',
        7,
        '2026-02-12',
        'happy',
        'https://gardenish.co/plants/spathiphyllum-wallisii',
        '#4a7a6b'
    ),
    (
        1,
        'Rubber Plant',
        'Ficus elastica',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Living Room',
        'Bright',
        '2026-02-27',
        10,
        '2026-01-19',
        'okay',
        'https://gardenish.co/plants/ficus-elastica',
        '#6b4a4a'
    ),
    (
        1,
        'ZZ Plant',
        'Zamioculcas zamiifolia',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Office',
        'Low',
        '2026-02-21',
        14,
        '2026-01-04',
        'happy',
        'https://gardenish.co/plants/zamioculcas-zamiifolia',
        '#556b4a'
    ),
    (
        1,
        'Spider Plant',
        'Chlorophytum comosum',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Kitchen',
        'Indirect',
        '2026-03-02',
        7,
        '2026-02-12',
        'happy',
        'https://gardenish.co/plants/chlorophytum-comosum',
        '#6b7a3a'
    ),
    (
        1,
        'Aloe Vera',
        'Aloe barbadensis',
        '/plantImages/Golden_Pothos_1.jpeg',
        'Windowsill',
        'Bright',
        '2026-02-19',
        21,
        '2026-12-05',
        'happy',
        'https://gardenish.co/plants/aloe-barbadensis',
        '#7a8a4a'
    );

SET
    FOREIGN_KEY_CHECKS = 1;

COMMIT;