# __PlantPartner__

## Introduction and Overview
### Purpose
  > This document will describe the design of the *Plant Partner* app. It is a simple application that helps users keep track
  of their plants, including water schedules, health status, and basic plant information.
### Scope
  > This app allows users to:
  > - Add and Remove plants
  > - Track watering frequency
  > - Record plant health notes
  > - Receive reminders for watering
  > - House information on stored plants

## System Architecture
  > The *Plant Partner* app follows a client-server architecture.

### Components:
  > - **Frontend**: Web-based interface for user interaction
  > - **Backend**: Handles data processing
  > - **Databse**: Stores plant data
  
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
  - `plantInfoID` - INT, AUTO_INCREMENT, Primary Key
  - `preferredSun`
  - `waterNeeds`
  - `tempRange`
  - `usdaZones`
  - `soilType`
  - `toxicity`
  - `drought`
  - `plantType`
  - `fertilizer`
  - `pruning`
  - `lifespan`
  - `matureSize`
  - `idealSoilPH`
  - `difficulty`
  - `careLink`

## Interface Design

## Component Design

## User Interface Design

## Assumptions and Dependencies

## Glossary of Terms
