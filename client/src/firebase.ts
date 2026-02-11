import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { config } from "./config";

// Initialize Firebase using centralized config
const app = initializeApp(config.firebase);
export const db = getFirestore(app);

// Enable Offline Persistence (Web)
// This might fail if multiple tabs are open, so we catch the error quietly
try {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.warn('Persistence not supported by browser');
        }
    });
} catch (e) {
    // Ignore errors in environments that don't support it
}