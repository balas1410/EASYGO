# EASY GO — AI-Driven Wheelchair-Accessible Route Detection and Planning Platform

**Tagline:** *Accessible Routes. Independent Journeys.*

EASY GO is a modern, responsive, frontend-first React + Vite web application designed for wheelchair users and people requiring accessible mobility assistance. It combines interactive multi-stop route planning, transparent 0–100 accessibility scoring, saved favourite places, ultrasonic obstacle detection telemetry from an ESP32 prototype (with **zero camera features**), remote-control simulation, AI-assisted route comparison, and role-protected usage analytics.

---

## Quick Start (`npm install` & `npm run dev`)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment configuration (optional for Demo Mode)
cp .env.example .env

# 3. Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Core Architecture & Features

1. **Custom 2D Wheelchair Brand Logo (`src/components/EasyGoLogo.jsx` & `public/favicon.svg`)**
   - Flat 2D vector silhouette of a person seated in a wheelchair with a large rear wheel, small front caster wheel, and electric blue (`#2563EB`), cyan (`#22D3EE`), and teal (`#14B8A6`) gradients.
2. **Animated Splash Screen (`src/pages/SplashScreen.jsx`)**
   - 2.5-second animated intro with rotating wheelchair wheels, Skip Intro button, and automatic `prefers-reduced-motion` support.
3. **Email/Phone Login, Registration & 6-Digit OTP Verification (`src/pages/Login.jsx`, `Register.jsx`, `VerifyOTP.jsx`)**
   - Switch seamlessly between Email and Phone (with country code selector), validate inputs, and test 6-digit OTP auto-focus, paste, and countdown timer in clearly labeled Demo Mode.
4. **Smart Mobility Command Center (`src/pages/Dashboard.jsx`)**
   - 11 live/demo status cards, quick actions, prominent multi-stop corridor visual, explainable score breakdown, and system notifications.
5. **Interactive Map & Synchronized Accessible Route Planner (`src/pages/InteractiveMap.jsx`, `RoutePlanner.jsx`)**
   - Place a Green Starting Point, multiple numbered Orange Intermediate Stops (add, remove, reorder), and a Red Final Destination.
   - Synchronized state between Map and Planner, OpenStreetMap Nominatim geocoding + demo gazetteer fallback, and OSRM road routing + curved multi-waypoint urban corridor geometry fallback.
6. **Explainable Accessibility Score (`src/utils/accessibilityScoring.js`)**
   - Transparent 0–100 calculation with configurable weights. Missing surface or slope evidence is explicitly marked as `Unknown` / `Unavailable` and never treated as proof that a route is accessible.
7. **Favourite Places (`src/pages/FavouritePlaces.jsx`)**
   - Save Home, College, Hospital, Workplace, and custom locations with confirmation before deletion and one-click assignment to Start, Stop, or Destination.
8. **Wheelchair Remote Control (`src/pages/RemoteControl.jsx`)**
   - Forward, Backward, Left, Right, Stop, Emergency Stop, PWM speed slider (1–5), connection-loss lockout, and command history log.
9. **Ultrasonic Obstacle Detection (`src/pages/ObstacleDetection.jsx`)**
   - **Strictly zero camera features.** Displays ESP32 ultrasonic distance in cm, Clear/Warning/Detected status, configurable warning threshold, Recharts time-series area chart, and hardware troubleshooting guide.
10. **AI Path Detection (`src/pages/AIPathDetection.jsx`)**
    - Camera-free, transparent rule-based route feasibility comparison across candidate paths.
11. **Usage Analytics & Reports (`src/pages/AnalyticsReports.jsx`)**
    - Role-protected administrator view with 13 summary cards, 10 Recharts visualizations, date filters, searchable/sortable/paginated activity table, CSV download, and print-to-PDF support.
12. **Modular Backend-Ready Services (`src/services/*.js`)**
    - Includes `authService.js`, `userService.js`, `mapService.js`, `routeService.js`, `favouriteService.js`, `sensorService.js`, `wheelchairService.js`, `analyticsService.js`, `notificationService.js`, and `reportService.js`.

---

## Transparency & Safety Restrictions
- **No Camera Functionality:** Completely excludes any camera or video-vision input.
- **Clearly Labeled Demo Mode:** When `VITE_API_BASE_URL` or physical ESP32 hardware is not connected, all simulated OTP flows, routes, ultrasonic readings, remote commands, and analytics are explicitly labeled as **Demo Mode**.
