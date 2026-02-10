# EcoWallet Server 🖥️

The backend for EcoWallet acts as an API layer between the frontend and the database (Firebase Firestore).

## 🛠 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database SDK:** Firebase Admin SDK
*   **In-Memory Fallback:** The server automatically uses local memory storage if no Firebase credentials are provided.

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Server
```bash
npm run dev
```
The server runs on `http://localhost:3001`.

## 🔥 Firebase Configuration

To enable persistent data storage:

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Navigate to **Project Settings > Service Accounts**.
3.  Generate a new Private Key.
4.  **Option A (Local):** Save the file as `serviceAccountKey.json` in this `server/` directory.
5.  **Option B (Production/Env):** Set the following environment variables in a `.env` file:
    ```ini
    FIREBASE_PROJECT_ID=your-project-id
    FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

## 🔒 Firestore Security Rules

Although the backend uses the Admin SDK (which bypasses rules), these rules define the expected data schema and validation logic. You can deploy these to your Firestore Console to ensure data integrity if you ever connect a client directly.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // --- Helper Functions ---
    // Checks if a field is either missing (undefined) or is a String
    function isOptionalString(field) {
      return !((field in request.resource.data) && !(request.resource.data[field] is string));
    }

    // --- Transactions Collection ---
    match /transactions/{transactionId} {
      // Allow public access for Family Mode
      allow read, delete: if true;
      
      // Enforce Schema on Create/Update
      allow create, update: if 
        request.resource.data.title is string &&
        request.resource.data.amount is number &&
        // Ensure type is strictly 'income' or 'expense'
        (request.resource.data.type == 'income' || request.resource.data.type == 'expense') &&
        request.resource.data.date is string &&
        request.resource.data.category is string &&
        request.resource.data.icon is string &&
        // Optional metadata
        isOptionalString('createdBy');
    }

    // --- Shopping List Collection ---
    match /shopping/{itemId} {
      allow read, delete: if true;
      
      // Enforce Schema on Create/Update
      allow create, update: if 
        request.resource.data.name is string &&
        
        // Quantity Validation
        request.resource.data.quantity is number &&
        request.resource.data.quantity >= 1 &&
        
        // Status Boolean
        request.resource.data.isPurchased is bool &&
        
        // Optional metadata
        isOptionalString('category') &&
        isOptionalString('addedBy');
    }
  }
}
```
