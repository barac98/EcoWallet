# EcoWallet 🌿

EcoWallet is a mobile-first, Progressive Web Application (PWA) designed to help users track expenses and manage shopping lists. It features a modern, dark-mode compatible UI, offline capabilities, and a full-stack architecture with data synchronization.

## 🚀 Features

*   **Dashboard Overview:** Real-time visualization of total income vs. expenses with a spending progress bar.
*   **Transaction Tracking:** Log expenses with categories, icons, and timestamps.
*   **Smart Shopping List:** Add items, mark them as purchased, and clear completed items.
*   **Budget Analytics:** Visual bar charts comparing income and expenses over time.
*   **Offline Support:**
    *   **PWA:** Installable on iOS and Android (Manifest & Service Worker included).
    *   **Data Caching:** Browsing history remains available without internet.
    *   **Fallback:** Uses LocalStorage if the backend is unreachable.
*   **Backend:** Node.js/Express server with optional Firebase Firestore persistence (defaults to in-memory storage if not configured).

## 🛠 Tech Stack

*   **Frontend:** React 18, Vite, Tailwind CSS, Lucide React (Icons), Recharts (Analytics), Vite PWA Plugin.
*   **Backend:** Node.js, Express, Firebase Admin SDK.
*   **Language:** TypeScript (Frontend), JavaScript (Backend).

## 🏁 Getting Started

The project is structured as a monorepo with `client` and `server` directories. You will need two terminal instances to run the full stack.

### 1. Backend Setup

The backend runs on port `3001`.

```bash
cd server

# Install dependencies
npm install

# Start the server (Development mode with nodemon)
npm run dev
```

*Note: By default, the server uses an **In-Memory Database**. Data will reset when the server restarts. To enable persistent storage, add a `serviceAccountKey.json` from Firebase to the `server/` folder.*

### 2. Frontend Setup

The frontend runs on port `5173` (default Vite port) and proxies API requests to the backend.

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser to `http://localhost:5173`.

## 📱 PWA & Mobile Installation

To test the PWA functionality:
1.  Run the frontend in production mode: `npm run build && npm run preview`.
2.  Open `http://localhost:4173`.
3.  **Chrome:** Click the install icon in the address bar.
4.  **Mobile:** Open the IP address on your phone and select "Add to Home Screen".

## 📂 Project Structure

```
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Dashboard, ShoppingList, etc.)
│   │   ├── api.ts          # API Service with Offline Fallback logic
│   │   └── types.ts        # TypeScript Interfaces
│   ├── vite.config.ts      # Vite & PWA Configuration
│   └── public/             # Static Assets
│
├── server/                 # Express Backend
│   ├── index.js            # Server entry & API Routes
│   └── serviceAccountKey.json # (Optional) Firebase Credentials
│
└── README.md
```

## 🔒 Offline Strategy

The app implements an **Optimistic UI** with **Network-First, Cache-Fallback** strategy:
1.  **Read Operations:** Tries to fetch from the API. If it fails, it loads the last known state from `localStorage`.
2.  **Write Operations:** Sends data to the API. If the API is down, it alerts the user (future improvements will include a sync queue).
3.  **Assets:** HTML, CSS, and JS are cached by the Service Worker for instant loading.
