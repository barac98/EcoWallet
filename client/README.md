# EcoWallet Client 📱

The frontend for EcoWallet is a Single Page Application (SPA) built to be fast, responsive, and installable.

## 🛠 Tech Stack

*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **PWA:** Vite Plugin PWA (Service Workers, Manifest)
*   **Routing:** React Router DOM

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

## ⚙️ Configuration

The app connects to the backend via the `VITE_API_URL` environment variable.

*   **Development:** Defaults to `/api` (proxied to `localhost:3001` via `vite.config.ts`).
*   **Production:** Create a `.env` file or set the variable in your host settings:
    ```ini
    VITE_API_URL=https://your-backend-url.onrender.com/api
    ```

## 📱 PWA Testing
To test the "Add to Home Screen" functionality and offline capabilities:
1.  Run `npm run build`.
2.  Run `npm run preview`.
3.  Open `http://localhost:4173` in your browser.
