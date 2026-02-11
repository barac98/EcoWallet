# EcoWallet Server 🖥️

The backend for EcoWallet acts as an API layer and data manager. It bridges the frontend with Firebase Firestore and provides utility endpoints.

## 🛠 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** Firebase Firestore (via `firebase-admin` SDK)
*   **Docs:** Swagger (OpenAPI 3.0)

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Lightweight ping to wake up the server. Returns `200 OK`. |
| `GET` | `/api/transactions` | Fetch all transactions. |
| `POST` | `/api/transactions` | Create a new income/expense record. |
| `GET` | `/api/shopping` | Fetch current shopping list. |
| `POST` | `/api/shopping` | Add item to list. |
| `PATCH` | `/api/shopping/:id` | Update item (toggle status, change quantity). |
| `DELETE`| `/api/shopping/clear-purchased` | Batch delete all purchased items. |

*Full interactive documentation available at `/api-docs` when server is running.*

## 🏃‍♂️ Getting Started

### 1. Install
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Server runs on port `3001`.

## 🔥 Database Connection

The server connects to Firestore using the **Admin SDK**, which bypasses client-side security rules. This allows the server to perform maintenance tasks (like batch deletion) securely.

### Setup
1.  Place your `serviceAccountKey.json` in the `server/` root.
2.  **OR** use Environment Variables (recommended for production):
    ```ini
    FIREBASE_PROJECT_ID=...
    FIREBASE_CLIENT_EMAIL=...
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

### Fallback Mode
If no Firebase credentials are found, the server automatically defaults to an **In-Memory Database**. Data will persist only as long as the server process is running. This is useful for quick testing without setting up Firebase.

## 🚀 Deployment (Render/Heroku)

This server is designed to be deployed as a Web Service.
*   **Build Command:** `npm install`
*   **Start Command:** `npm start`
*   **Health Check Path:** `/api/health`
