# Web Crawl Accessibility and Compliance Monitoring System

This project is a backend-driven system that crawls websites, analyzes pages for accessibility issues, and stores the results so teams can monitor and fix them over time.

The main idea behind this system is pretty simple: automatically scan websites, detect accessibility problems (like missing alt tags or improper heading structure), and provide a structured way to track and resolve those issues.

Instead of manually checking pages, this system continuously crawls a site and reports accessibility violations.

---

## Why This Project Exists

Accessibility is often ignored until late in development, and by that time fixing issues becomes expensive.

The goal of this system is to make accessibility monitoring automatic. It periodically crawls websites, analyzes the content using accessibility tools, and keeps track of issues across different page versions.

This helps teams:

- detect accessibility problems early
- monitor regressions
- keep track of fixes
- maintain compliance standards

---

## Services

### API Gateway

Handles routing and acts as the entry point for the frontend.

### Auth Service

Responsible for authentication, token management, and user session handling.

### Crawl Manager

Creates crawl jobs and manages crawl execution.

### Crawl Worker

Actually visits the pages using a headless browser and extracts HTML content.

### Analysis Service

Runs accessibility checks (using axe-core) on the crawled pages and records violations.

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

- migrations

The idea here is that reusable logic (models, validation, config, etc.) lives inside `packages`, while the actual services live inside `apps`.

---

## Running the Project

- First install dependencies.
  - pnpm install

- Then put enviornment variables in .env (refer .env.example)

- Then run the services.
  - pnpm dev

- If you want to run tests:
  - pnpm test
  - pnpm test:coverage

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
