# Web Crawl Accessibility and Compliance Monitoring System

This project is a backend-driven system that crawls websites, analyzes pages for accessibility issues, and stores the results so teams can monitor and fix them over time.

The main idea behind this system is: automatically scan websites, detect accessibility problems (like missing alt tags or improper heading structure), and provide a structured way to track and resolve those issues.

Instead of manually checking pages, this system continuously crawls a site and reports accessibility violations.

---

## Why This Project Exists

The goal of this system is to make accessibility monitoring automatic. It periodically crawls websites, analyzes the content using accessibility tools, and keeps track of issues across different page versions.

This helps teams:

- detect accessibility problems early
- monitor regressions
- keep track of fixes
- maintain compliance standards

---

## Services

Since crawling and report generation is a CPU intensive task these are handled by separate services to asynchronously handle these requests in non blocking manner.

### API Gateway

Handles routing and acts as the entry point for the frontend. In case any kind of transformation or control of data can be handled from this microservice.

### Auth Service

Responsible for authentication, token management, and user session handling.

### Crawl Manager

Creates crawl jobs and manages crawl execution.

### Crawl Worker

Actually visits the pages using a headless browser and extracts HTML content.

### Analysis Service

Runs accessibility checks (using axe-core) on the crawled pages and records violations.

### Reporting Service

Responsible for powering up dashboard and reports part. Exposes API's for analytics part of the project.

### Report Generator

Responsible for creating pdf reports for site issues and sending generated pdf through email to user.

---

## Main Features

- Website crawling using a headless browser
- Accessibility analysis using axe-core
- Issue tracking and history
- Pagination and filtering for results
- Authentication with access + refresh tokens
- Microservice-based architecture

---

## Technologies Used

Backend:

- Node.js
- Express
- TypeScript
- Sequelize
- PostgreSQL
- Redis

Crawling:

- Puppeteer

Accessibility Analysis:

- axe-core

Testing:

- Vitest

Messaging:

- Queue based communication between services

Reverse Proxy:

- Nginx

S3 Bucket Store:

- Minio

Logging:

- Pino

---

## Project Structure

apps

- api-gateway
- auth-service
- crawl-manager
- crawl-worker
- analysis-service

packages

- shared-config
- shared-utils
- shared-validation
- shared-types

infra

- database
  - config
  - migrations

The idea here is that reusable logic (models, validation, config, etc.) lives inside `packages`, while the actual services live inside `apps`.

---

## Swagger Docs

The swagger documentation can be found in http://localhost/api/docs

## System Architecture Diagram

Find the architecture diagram here:
https://drive.google.com/file/d/1thZ8dVFunbFtJCXpFJB0sB2fPESnxAwQ/view?usp=sharing

## Running the Project

- First install dependencies.
  - pnpm install
    (Docker Image is being used for postgress, Minio, RabbitMQ use `docker compose up --build` to set up if you dont want to run in local)

- Then put enviornment variables in .env (refer .env.example)

- Then create uploads and postgress folder in root as host binded mounts are being user and docker image of postgress and minio is being used

- Then run the services.
  - pnpm dev

- If you want to run tests:
  - pnpm test

- Or if you want to use docker
  - docker compose up --build

---

## Testing

All major services include unit tests written with Vitest.

The goal was to cover:

- service logic
- error handling
- edge cases
- queue processing logic

Mocks are used heavily for browser instances and repositories to isolate the logic being tested.

---
