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
* have a todo to dockerize this setup

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
- [ ] Create a Git repository for the project
- [ ] Dockerize the application
- [ ] Set up CI/CD flow through Azure
- [ ] Create a home/splash/welcome screen
- [ ] Implement search/filter functionality
- [ ] Create a stats page
- [ ] Implement edit functionality for tasks
- [ ] Create an AI helper to assist with task management

## CI/CD with Azure
- Set up CICD pipelines through Azure DevOps.
- Ensure that each push to the repository triggers automated builds, followed by deployment.

## Dockerization
- Create a `Dockerfile` for the application to containerize it.
- Set up a `docker-compose.yml` for local development to manage dependencies.
