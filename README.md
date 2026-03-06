# 🌿 Plant Partner

A plant care tracking web app built with React, Node.js, and MySQL.

## 📚 Documentation

- [Self-Hosting Guide](https://xan-d.github.io/PlantPartner/Documentation/SelfHostingGuide.html)
- [Deploy Cheatsheet](https://xan-d.github.io/PlantPartner/Documentation/UpdateCycle.html)

## 🌐 Live Site
[plant-partner.com](https://plant-partner.com)

## To do
- Add user dashboard (landing page)
- Send push/text notifs for plant watering 
- refactor plant card component
- create fetch option when creating card
- add filter options on plant grid
- add plsql to prevent SQL injejctions

## Introduction and Overview

### Table of Contents
- [Introduction and Overview](#introduction-and-overview)
- [System Architecture](#system-architecture)
- [Data Design](#data-design)
- [Interface Design](#interface-design)
- [Component Design](#component-design)
  - [Plant Management Component](#11-plant-management-component)
  - [Watering Reminder Component](#12-watering-reminder-component)
  - [User Interface Component](#13-user-interface-component)
- [User Interface Design](#user-interface-design)
- [Assumptions and Dependencies](#assumptions-and-dependencies)

---

### Purpose
This document describes the design of the **Plant Partner** application. Plant Partner is a simple system that helps users manage and monitor their plants by tracking watering schedules, health status, and essential plant information.

### Scope
The Plant Partner app allows users to:
- Add and remove plants  
- Track watering frequency  
- Receive watering reminders  
- Store and view detailed plant information  

---

## System Architecture

The **Plant Partner** app follows a client–server architecture.

### Components
- **Frontend:** Web-based interface that allows users to interact with the application  
- **Backend:** Handles data processing and application logic
- **Database:** Stores plant and plant-related information (mysql2) 

---

## Data Design

### Database Tables

## Users
Stores registered users of the system.

| Column         | Type          | Null | Key | Default           | Description                           |
|----------------|---------------|------|-----|-----------------|---------------------------------------|
| `userID`       | INT           | NO   | PK  | AUTO_INCREMENT   | Primary key, unique user identifier   |
| `email`        | VARCHAR(255)  | NO   | UNI |                 | User's email address, must be unique  |
| `passwordHash` | VARCHAR(255)  | NO   |     |                 | Hashed password                        |
| `displayName`  | VARCHAR(255)  | YES  |     | NULL            | Optional display name                  |
| `createdAt`    | TIMESTAMP     | YES  |     | CURRENT_TIMESTAMP | Record creation timestamp             |

---

## Plants
Stores user-specific plant records and current status information.

| Column        | Type          | Null | Key | Default           | Description                                      |
|---------------|---------------|------|-----|-----------------|--------------------------------------------------|
| `plantID`     | INT           | NO   | PK  | AUTO_INCREMENT   | Primary key, unique plant identifier            |
| `userID`      | INT           | YES  | FK  |                 | References `Users(userID)` to associate owner   |
| `name`        | VARCHAR(255)  | NO   |     |                 | Plant's common name                              |
| `scientific`  | VARCHAR(255)  | NO   |     |                 | Plant's scientific name                          |
| `image`       | VARCHAR(255)  | YES  |     | NULL            | Optional image URL or file path                  |
| `room`        | VARCHAR(255)  | YES  |     | NULL            | Room or location of the plant                    |
| `light`       | VARCHAR(100)  | YES  |     | NULL            | Light requirements (e.g., low, medium, bright)  |
| `lastWatered` | DATE          | YES  |     | NULL            | Date the plant was last watered                  |
| `waterFreq`   | INT           | YES  |     | NULL            | Suggested water frequency in days               |
| `lastFed`     | DATE          | YES  |     | NULL            | Date the plant was last fertilized              |
| `health`      | VARCHAR(50)   | YES  |     | NULL            | Current health status (e.g., healthy, wilted)  |
| `careLink`    | VARCHAR(500)  | YES  |     | NULL            | Optional link to care instructions or reference |
| `color`       | VARCHAR(7)    | YES  |     | NULL            | Optional color code for labeling                |

**Foreign Key:**  
- `userID` → `Users(userID)`

### Data Rules
- `wateringFrequency` must be greater than 0  
- `lastWatered` must not be a future date
- `userID` must not be null in any given plant  

---

## Component Design

The **Plant Partner** app is divided into several logical components. Each component is responsible for a specific portion of the system’s functionality.

### 1. Plant Management

**Purpose:**  
Handles displaying plants and adding new plants.

**Code Components:**  
- `PlantCard.jsx` — displays individual plant info  
- `AddPlantCard.jsx` — card to trigger adding a new plant  

**Responsibilities:**  
- Show plant details (name, image, last watered, health)  
- Trigger add plant workflow  

**Inputs:**  
- Plant data (via props or parent page state)  
- `onClick` callback for AddPlantCard  

**Outputs:**  
- Visual display of plants  
- Callback events for adding plants  

**Dependencies:**  
- Pages: `home.jsx`, `plantgrid.jsx`, `addplant.jsx`  

---

### 2. Watering Reminder

**Purpose:**  
Calculate plant watering status and optionally notify users.

**Code Components:**  
- Currently, logic lives in `PlantCard.jsx`  

**Responsibilities:**  
- Compute next watering date (from `lastWatered` + `waterFreq`)  
- Highlight overdue plants  

**Inputs:**  
- `lastWatered`  
- `waterFreq`  

**Outputs:**  
- Display watering status  
- Optional reminder notifications  

**Dependencies:**  
- Plant Management Component  

---

### 3. User Interface

**Purpose:**  
Handles overall app layout and user interaction.

**Code Components / Pages:**  
- `home.jsx` — dashboard  
- `plantgrid.jsx` — grid view of plants  
- `addplant.jsx` — form to add a new plant  
- `updateplant.jsx` — form to update an existing plant  

**Responsibilities:**  
- Compose PlantCard and AddPlantCard components  
- Handle user interactions  
- Trigger API calls through pages/hooks  

**Inputs:**  
- User actions (clicks, form input)  

**Outputs:**  
- Updated UI  
- API requests to backend or state updates  

**Dependencies:**  
- Plant Management Component  
- Watering Reminder logic

## User Interface Design

### Key Screens
- **Dashboard:** Displays all plants and their next watering dates  
- **Add Plant Screen:** Form for entering new plant information  
- **Plant Details Screen:** Shows plant health, notes, and detailed care information  

### Usability Considerations
- Simple and intuitive forms  
- Clear visual indicators for plant health  
- Readable and accessible color palette  

---

## Assumptions and Dependencies

### Assumptions
- Users have basic familiarity with web applications  
- Each database instance supports a single user  

### Dependencies
- **Backend framework:** Node.js  
- **Database system:** MySQL2 
