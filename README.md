# EcoWallet 🌿

EcoWallet is a mobile-first, Progressive Web Application (PWA) designed to help families track expenses and manage shopping lists collaboratively. It features a modern dark-mode UI, offline capabilities, and data synchronization.

## 📂 Project Structure

This project is organized as a monorepo with clear separation between frontend and backend:

*   **[Client (Frontend)](./client/README.md):** Documentation for the React application.
*   **[Server (Backend)](./server/README.md):** Documentation for the Node.js API and Database.

## 🚀 Quick Start

To get the full application running locally:

1.  **Setup Server:**
    Open a terminal, navigate to `server/`, and follow the [Server Instructions](./server/README.md).
    ```bash
    cd server
    npm install
    npm run dev
    ```

2.  **Setup Client:**
    Open a *new* terminal, navigate to `client/`, and follow the [Client Instructions](./client/README.md).
    ```bash
    cd client
    npm install
    npm run dev
    ```

3.  **Open App:**
    Visit `http://localhost:5173` in your browser.

## 📱 Features
*   **Expenses:** Track income and expenses with visual charts.
*   **Shopping:** Real-time shopping list with quantities and "Complete Trip" workflow.
*   **Family Mode:** Simple user switching profile system.
*   **PWA:** Installable on mobile devices with offline support.
