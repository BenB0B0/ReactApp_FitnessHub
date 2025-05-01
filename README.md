# Fitness Hub Project
⭐[App Preview](https://reactapp-fitnesshub-frontend.onrender.com)

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Features](#features)
4. [Todos](#todos)

## Description
This project is a fitness tracking application. You can track individual workouts, get generalized stats, and interact with an ai workout coach.

## Installation
Follow these steps to get the project up and running on your local machine:

### STACK
[React/Vite]
[Flask] [SQLAlchemy] [*Supabase*]
[Docker]
[Render-(hosting)]

> (below steps are replaced now with docker)
1. Clone the repository:
    ```bash
    git clone
    cd APP_FITNESSTRACKER_V3
    ```

2. Install dependencies:
    ```bash
    cd frontend
    npm install <dependencies>
    cd backend
    pip install <dependencies>
    ```

3. Run the app locally:
    ```bash
    cd frontend
    npm start
    cd backend
    py app.py
    ```

## Todos
1. WORKOUT PAGE:
- [x] Auth0 Flow
- [x] Workout Model/Services (create, update, delete)
- [x] Table and Cards views
- [x] Cards collapse ui
- [x] Edit functionality
- [x] Banner notifications on delete/create/edit
- [x] Search/filter functionality
- [x] Calendar view (colored by cardio/strength/mix)
- [x] Export to excel/csv
- [x] Notes (notes)
2. OTHER PAGES:
- [x] Routines Page 
- [x] Stats page
3. DB:
- [X] Upgrade to supabase postgres db
4. HOSTING/PIPELINE:
- [x] Dockerize the application
- [x] CI/CD + Hosting (hosting on *render*)
5. AI:
- [ ] Create an AI helper to assist with auto routines (api key in settings?)
6. OUTSIDE SOURCES:
- [ ] Strava API (routes, heartrate, calories, steps)
7. NICE TO HAVES:
- [ ] Themes
- [ ] Mobile
