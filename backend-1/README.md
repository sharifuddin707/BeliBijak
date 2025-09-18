# BeliBijak Backend

## Overview
BeliBijak is a backend application built using Node.js and Express. It serves as the server-side component for managing user and store data, utilizing Firebase Firestore for data storage.

## Project Structure
```
backend
├── server.js               # Initializes the Express server and defines API routes
├── package.json            # npm configuration file with dependencies and scripts
├── serviceAccountKey.json  # Firebase service account credentials
└── README.md               # Documentation for the project
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd BeliBijak/backend
   ```

2. **Install dependencies**
   Ensure you have Node.js installed, then run:
   ```
   npm install
   ```

3. **Configure Firebase**
   - Obtain your Firebase service account key and save it as `serviceAccountKey.json` in the backend directory.

4. **Run the server**
   ```
   node server.js
   ```
   The server will start on port 3000.

## API Endpoints

### Users
- **GET /users**: Retrieve a list of users.
- **POST /users**: Create a new user with a name and email.

### Stores
- **GET /stores**: Retrieve a list of grocery stores.
- **POST /stores**: Create a new grocery store with a name.
- **PUT /stores/:id**: Update the name of a grocery store by ID.
- **DELETE /stores/:id**: Delete a grocery store by ID.

## License
This project is licensed under the MIT License.