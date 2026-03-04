# 🌿 Plant Partner

A plant care tracking web app built with React, Node.js, and MySQL.

## 📚 Documentation

- [Self-Hosting Guide](https://xan-d.github.io/PlantPartner/Documentation/SelfHostingGuide.html)
- [Deploy Cheatsheet](https://xan-d.github.io/PlantPartner/Documentation/DeployCheatsheet.html)

## 🌐 Live Site
[plant-partner.com](https://plant-partner.com)

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
- Record plant health notes  
- Receive watering reminders  
- Store and view detailed plant information  

---

## System Architecture

The **Plant Partner** app follows a client–server architecture.

### Components
- **Frontend:** Web-based interface that allows users to interact with the application  
- **Backend:** Handles data processing and application logic  
- **Database:** Stores plant and plant-related information  

---

## Data Design

### Database Tables

#### Plants
Stores user-specific plant records and current status information.

- `plantID` — INT, AUTO_INCREMENT, NOT NULL, Primary Key  
- `name` — VARCHAR(100), NOT NULL  
- `plantInfoID` — INT, NOT NULL, Foreign Key  
- `lastWatered` — DATE, NOT NULL  
- `lastFertilized` — DATE, NOT NULL  
- `healthStatus` — VARCHAR(45), NOT NULL  
- `notes` — TEXT, NULL  

#### PlantInformation
Stores reference data describing plant care requirements.

- `plantInfoID` — INT, AUTO_INCREMENT, NOT NULL, Primary Key  
- `preferredSun` — VARCHAR(255), NULL  
- `waterNeeds` — VARCHAR(255), NULL  
- `waterFrequency` — INT, NOT NULL  
- `tempRange` — VARCHAR(255), NULL  
- `usdaZones` — VARCHAR(255), NULL  
- `soilType` — VARCHAR(255), NULL  
- `toxicity` — VARCHAR(255), NULL  
- `drought` — VARCHAR(255), NULL  
- `plantType` — VARCHAR(255), NULL  
- `fertilizer` — VARCHAR(255), NULL  
- `pruning` — VARCHAR(255), NULL  
- `lifespan` — VARCHAR(255), NULL  
- `matureSize` — VARCHAR(255), NULL  
- `idealSoilPH` — VARCHAR(255), NULL  
- `difficulty` — VARCHAR(255), NULL  
- `careLink` — VARCHAR(255), NULL  

### Data Rules
- `wateringFrequency` must be greater than 0  
- `lastWatered` must not be a future date  

---

## Interface Design

### Error Handling
- Invalid input returns a clear and descriptive error message  
- Missing or malformed data results in a `400 Bad Request` response  

---

## Component Design

The **Plant Partner** app is divided into several logical components. Each component is responsible for a specific portion of the system’s functionality.

### 1.1 Plant Management Component

**Purpose:**  
Manages all plant-related data within the system.

**Responsibilities:**
- Add new plants  
- Update existing plant information  
- Delete plants  
- Retrieve plant details for display  

**Inputs:**
- Plant name  
- Species  
- Watering frequency  
- Health status  
- Notes  

**Outputs:**
- Confirmation messages  
- Plant data for the user interface  

**Dependencies:**
- Database component  

---

### 1.2 Watering Reminder Component

**Purpose:**  
Determines when plants need to be watered and generates reminders.

**Responsibilities:**
- Calculate next watering dates  
- Identify overdue plants  
- Trigger reminder notifications  

**Inputs:**
- Last watered date  
- Watering frequency  

**Outputs:**
- List of plants requiring watering  
- Reminder messages  

**Dependencies:**
- Plant Management Component  

---

### 1.3 User Interface Component

**Purpose:**  
Facilitates interaction between the user and the system.

**Responsibilities:**
- Display plant lists and detailed views  
- Collect user input  
- Send requests to backend components  

**Inputs:**
- User actions (e.g., button clicks, form submissions)  

**Outputs:**
- API requests  
- Updated interface screens  

**Dependencies:**
- Plant Management Component  
- Watering Reminder Component  

---

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
- **Database system:** Firebase  
