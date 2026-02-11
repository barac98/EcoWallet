# EcoWallet Client 📱

The frontend for EcoWallet is a Single Page Application (SPA) built with performance and user experience in mind. It communicates with the custom Node.js backend for complex logic and listens directly to Firebase Firestore for real-time data updates.

## 🛠 Tech Stack

*   **Framework:** React 18 + Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Dark Mode default)
*   **State/Data:** Firebase SDK (Real-time listeners), React Context
*   **Routing:** React Router DOM v6
*   **PWA:** `vite-plugin-pwa`

## 🌟 Key Components

### 1. Server Awake Wrapper
Located in `src/components/ServerAwakeWrapper.tsx`.
Since the backend is hosted on a free-tier service (Render) that spins down after inactivity, this component:
*   Pings `/api/health` on app startup.
*   Shows a friendly "Waking up server..." overlay if the response takes >1.5 seconds.
*   Ensures the user doesn't stare at a blank screen or failed requests during cold starts.

### 2. Shopping List Logic
Located in `src/components/ShoppingList.tsx`.
*   **Optimistic Updates:** UI updates immediately while data saves to Firestore.
*   **Complete Trip:** Calculates the total cost of checked items, creates a new "Expense" transaction, and removes purchased items from the database in a batch operation.

### 3. Dashboard & Budgeting
Located in `src/components/Dashboard.tsx`.
*   Fetches real-time transaction data.
*   Allows users to set a "Monthly Income" via a modal.
*   Calculates "Remaining Balance" and "Spending Progress" dynamically.

## 🏃‍♂️ Development

### Install & Run
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## ⚙️ Configuration

The app uses `import.meta.env` for configuration.

| Variable | Description |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase Config |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Config |
| ... | (See `firebase.ts` for full list) |

## 📱 PWA & Offline Testing
To test the "Add to Home Screen" functionality and offline capabilities:
1.  Run `npm run build`.
2.  Run `npm run preview`.
3.  Open `http://localhost:4173` in your browser.
4.  Open DevTools -> Application -> Service Workers to simulate offline mode.
