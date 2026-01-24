# __Plant Partner__

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

### Purpose
  This document will describe the design of the *Plant Partner* app. It is a simple application that helps users keep track
  of their plants, including water schedules, health status, and basic plant information.
### Scope
  This app allows users to:
  - Add and Remove plants
  - Track watering frequency
  - Record plant health notes
  - Receive reminders for watering
  - House information on stored plants

## System Architecture
  The *Plant Partner* app follows a client-server architecture.

### Components:
  - **Frontend**: Web-based interface for user interaction
  - **Backend**: Handles data processing
  - **Databse**: Stores plant data
  
## Data Design
### Database Tables
#### Plants
  - `plantID` - INT, AUTO_INCREMENT, NOT NULL, Primary Key
  - `name` - varchar(100), NOT NULL
  - `plantInfoID` - INT, NOT NULL, Foreign Key
  - `lastWatered` - DATE, NOT NULL
  - `lastFertilized` - DATE, NOT NULL
  - `healthStatus` - varchar(45), NOT NULL
  - `notes` - TEXT, NULL

#### PlantInformation
  - `plantInfoID` - INT, AUTO_INCREMENT, NOT NULL, Primary Key
  - `preferredSun` - varchar(255), NULL
  - `waterNeeds` - varchar(255), NULL
  - `waterFrequency` - INT, NOT NULL
  - `tempRange` - varchar(255), NULL
  - `usdaZones` - varchar(255), NULL
  - `soilType` - varchar(255), NULL
  - `toxicity` - varchar(255), NULL
  - `drought` - varchar(255), NULL
  - `plantType` - varchar(255), NULL
  - `fertilizer` - varchar(255), NULL
  - `pruning` - varchar(255), NULL
  - `lifespan` - varchar(255), NULL
  - `matureSize` - varchar(255), NULL
  - `idealSoilPH` - varchar(255), NULL
  - `difficulty` - varchar(255), NULL
  - `careLink` - varchar(255), NULL

### Data Rules
  - `wateringFrequency` > 0
  - `lastWatered` <= current date

## Interface Design
### Error Handling
  - Invalid input returns a clear error message
  - Missing data is rejected with a 400 response

## Component Design

The Plant Tracker App is divided into several logical components. Each component is responsible for a specific part of the system’s functionality.

### 1.1 Plant Management Component

**Purpose:**  
Manages all plant-related data in the system.

**Responsibilities:**
- Add new plants  
- Update plant information  
- Delete plants  
- Retrieve plant details for display  

**Inputs:**
- Plant name  
- Species  
- Watering frequency  
- Health status  
- Notes  

**Outputs:**
- Confirmation of successful actions  
- Plant data for the user interface  

**Dependencies:**
- Database component

### 1.2 Watering Reminder Component

**Purpose:**  
Tracks when plants need to be watered and notifies the user.

**Responsibilities:**
- Calculate next watering date  
- Identify overdue plants  
- Trigger reminder notifications  

**Inputs:**
- Last watered date  
- Watering frequency  

**Outputs:**
- List of plants needing water  
- Reminder messages  

**Dependencies:**
- Plant Management Component  

### 1.3 User Interface Component

**Purpose:**  
Handles user interaction with the system.

**Responsibilities:**
- Display plant lists and details  
- Collect user input  
- Send requests to backend components  

**Inputs:**
- User actions (button clicks, form submissions)  

**Outputs:**
- API requests  
- Updated screens  

**Dependencies:**
- Plant Management Component  
- Watering Reminder Component  

## User Interface Design
### Key Screens
  - Dashboard: List of all plants and their next watering date
  - Add Plant Screen: Form to fill out to add new plants
  - Plant Details Screen: Displays plant health, notes, and detailed plant information

### Usability Considerations
  - Simple forms
  - Clear icons for plant health
  - Readable color palette

## Assumptions and Dependencies
### Assumptions
  - Users have familiarity with web apps
  - There is only one person using the app per database

### Dependencies
  - Backend framework: Node.js
  - Database system: Firebase
