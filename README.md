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

## 🏁 Getting Started (Local Development)

The project is structured as a monorepo with `client` and `server` directories.

### 1. Backend Setup

The backend runs on port `3001`.

```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup

The frontend runs on port `5173` (default Vite port) and proxies API requests to the backend.

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ☁️ Deployment on Render

You will deploy the Backend and Frontend as two separate services on [Render](https://render.com).

### Step 1: Deploy Backend (Web Service)

1.  Push your code to a GitHub repository.
2.  Log in to Render and click **New +** > **Web Service**.
3.  Connect your repository.
4.  **Configuration:**
    *   **Root Directory:** `server`
    *   **Runtime:** Node
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
5.  **Environment Variables:**
    *   Scroll down to "Environment Variables" and add the Firebase secrets from your `.env` file:
    *   `FIREBASE_PROJECT_ID`: (Your Project ID)
    *   `FIREBASE_CLIENT_EMAIL`: (Your Client Email)
    *   `FIREBASE_PRIVATE_KEY`: (Your Private Key - paste the entire string including `-----BEGIN...`).
6.  Click **Create Web Service**.
7.  **Copy the Service URL:** Once deployed, copy the URL (e.g., `https://ecowallet-api.onrender.com`).

### Step 2: Deploy Frontend (Static Site)

1.  Go to Render Dashboard and click **New +** > **Static Site**.
2.  Connect the **same** repository.
3.  **Configuration:**
    *   **Root Directory:** `client`
    *   **Build Command:** `npm install && npm run build`
    *   **Publish Directory:** `dist`
4.  **Environment Variables:**
    *   Add a variable to link to your backend:
    *   **Key:** `VITE_API_URL`
    *   **Value:** `https://your-backend-url.onrender.com/api` (Make sure to add `/api` at the end!)
5.  **Rewrite Rules (Important for React Router):**
    *   Go to the "Redirects/Rewrites" tab.
    *   Add a new rule:
        *   **Source:** `/*`
        *   **Destination:** `/index.html`
        *   **Action:** Rewrite
6.  Click **Create Static Site**.

Your app is now live! 🚀

---

## 🔥 Firebase Configuration (Database)

To enable persistent data storage using Firebase Firestore locally or in production:

### Step 1: Get Credentials
1.  Go to **Firebase Console > Project Settings > Service Accounts**.
2.  Click **"Generate new private key"**.
3.  Open the downloaded JSON file.

### Step 2: Configure Local Environment
1.  In `server/`, create a file named `.env`.
2.  Add the variables:
    ```ini
    FIREBASE_PROJECT_ID=...
    FIREBASE_CLIENT_EMAIL=...
    FIREBASE_PRIVATE_KEY="..."
    ```

## 📱 PWA & Mobile Installation

To test the PWA functionality:
1.  Run the frontend in production mode: `npm run build && npm run preview`.
2.  Open `http://localhost:4173`.
3.  **Chrome:** Click the install icon in the address bar.
4.  **Mobile:** Open the IP address on your phone and select "Add to Home Screen".
