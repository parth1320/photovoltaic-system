# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack photovoltaic (solar panel) management system. Users create projects with solar panel products, and the system automatically calculates and tracks electricity generation using real weather data.

## Commands

### Frontend (`/frontend`)
```bash
npm start        # Dev server on http://localhost:3000
npm run build    # Production build
npm test         # Run tests
```

### Backend (`/backend`)
```bash
npm start        # Starts with nodemon on port 5000
```

Both must run simultaneously for the app to work.

## Architecture

### Backend (`/backend`)
- **Entry**: `server.js` — connects to MongoDB Atlas, registers all routes, starts Express on port 5000
- **Auth**: JWT-based. `middleware/authorization.js` verifies Bearer tokens from `Authorization` header. Secret key is hardcoded as `"4$98Ys2a#Pq1!bD3"`.
- **Routes**: `users.js`, `project.js`, `products.js`, `report.js`
- **Models**: `User`, `Project` (embeds product subdocuments), `Products`, `Report`
- **Cron job** (`utils/cronjob.js`): Runs hourly (`0 * * * *`). For each project/product, fetches historical weather from OpenWeatherMap API, calculates power output, and appends to a daily `Report` document.
- **Electricity utils** (`utils/electricity.js`): Physics calculations for power output, electricity generation based on temperature, time of day, orientation, inclination, and panel area.
- **Product seeding** (`utils/products.js`): Called on server start to seed default solar panel products.

### Frontend (`/frontend/src`)
- **Routing**: React Router v6 with `createBrowserRouter`. `Auth.js` (at `/`) handles redirect logic based on token presence.
- **HTTP**: All API calls use `axiosInstance/setHeader.js` — an Axios instance with a request interceptor that automatically attaches the JWT from `localStorage` as a Bearer token.
- **Pages**: `Login`, `Register`, `Dashboard`, `Profile`, `Logout`, and nested under `/dashboard`: `CreateProject`, `ProjectDetails`, `VisualMap`
- **Map**: `VisualMap` uses React Leaflet to display product/panel locations geographically.
- **Styling**: Mix of Tailwind CSS, Bootstrap 5, MUI (Material UI), and CSS modules.
- **Notifications**: `react-toastify` for user feedback.

### Data Flow
1. User registers/logs in → JWT stored in `localStorage`
2. User creates a Project with Products (solar panels), each with GPS coordinates, orientation, inclination, and area
3. Backend cron job fetches weather for each product's coordinates hourly → calculates `electricityGenerated` → accumulates into daily Report documents
4. Frontend `ProjectDetails` and reports pages display the generated electricity data
