# Fitness Hub Project

## Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Features](#features)
4. [Todos](#todos)
5. [CI/CD with Azure](#cicd-with-azure)
6. [Dockerization](#dockerization)

## Description
This project is a fitness tracking application. You can track individual workouts, get generalized stats, and interact with an ai workout coach.

## Installation
Follow these steps to get the project up and running on your local machine:
> (have a todo to dockerize this setup)

### STACK
[React/Vite]
[Flask] [SQLAlchemy]
[Docker]
[Azure]

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
- [ ] Upgrade from SQL Alch
4. PIPELINE:
- [ ] Dockerize the application
- [ ] Set up CI/CD flow through Azure
5. AI:
- [ ] Create an AI helper to assist with auto routines (api key in settings?)
6. OUTSIDE SOURCES:
- [ ] Strava API (routes, heartrate, calories, steps)
7. NICE TO HAVES:
- [ ] Themes
- [ ] Mobile

## CI/CD with Azure
- Set up CICD pipelines through Azure DevOps.
- Ensure that each push to the repository triggers automated builds, followed by deployment.

## Dockerization
- Create a `Dockerfile` for the application to containerize it.
- Set up a `docker-compose.yml` for local development to manage dependencies.
