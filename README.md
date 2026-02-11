# EcoWallet 🌿

EcoWallet is a modern, mobile-first **Progressive Web Application (PWA)** designed to simplify family budgeting and shopping. It combines a robust React frontend with a Node.js/Express backend and Firebase Firestore for real-time data synchronization.

## ✨ Key Features

*   **Real-Time Budgeting:** Track monthly income vs. expenses with visual progress bars and instant updates.
*   **Smart Shopping List:** 
    *   Collaborative list with quantity tracking.
    *   **"Complete Trip" Workflow:** Seamlessly convert purchased items into a transaction record and clear the list in one tap.
*   **Server Cold Start Detection:** Intelligent UI that detects if the backend (hosted on free tiers like Render) is sleeping and keeps the user informed while it wakes up.
*   **Analytics:** visualize spending trends over the last 6 months.
*   **Family Mode:** Simple profile switching (Mom, Dad, Family) to tag who added items or expenses.
*   **Offline-First:** Fully installable PWA that caches assets for offline use.

## 📂 Project Structure

This project is organized as a monorepo:

*   **[Client (Frontend)](./client/README.md):** React + Vite application.
*   **[Server (Backend)](./server/README.md):** Node.js + Express API + Firebase Admin SDK.

## 🚀 Quick Start

To get the full application running locally:

### 1. Setup Server
Open a terminal, navigate to `server/`, and follow the [Server Instructions](./server/README.md).
```bash
cd server
npm install
npm run dev
```
*Server runs on `http://localhost:3001`*

### 2. Setup Client
Open a *new* terminal, navigate to `client/`, and follow the [Client Instructions](./client/README.md).
```bash
cd client
npm install
npm run dev
```
*Client runs on `http://localhost:5173`*

### 3. Open App
Visit `http://localhost:5173` in your browser.

## 🛠 Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
*   **Backend:** Node.js, Express, Swagger (OpenAPI).
*   **Database:** Google Firebase Firestore (NoSQL).
*   **Deployment:** Designed for static hosting (Client) and Node.js runtime (Server).

## 📱 PWA Features
This app is designed to be installed on mobile devices.
*   **Manifest:** Custom app icon and splash screen properties.
*   **Service Workers:** Caches static assets for instant loading.
*   **Touch Optimizations:** Large touch targets, bottom navigation, and mobile-specific layouts.
