# BeliBijak App in Development

This is an app that will use a navigation starter template for React Native apps using Expo and React Navigation. It is still in development

## App Architecture

 - React Native Frontend + Express Backend + NodeJs + Cloud Firebase Database
 - Deployed on Render

 NOTE IMPORTANT!!!: If you did not see any displayed data in the Home screen, it means the backend is not loaded yet due to Render's low computing power (I chose the free version). Please wait abit.

## Update from previous Assignment 2

 - I moved the Profile and Setting buttons to the navigation tabs
 - Connected the Frontend React Native app to the express backend which will handle all the requests
 - Connected my backend to my Cloud Firebase Database. (So my app will need internet connection to retrieved the data)
 - Needed to add GOOGLE_SERVICE_ACCOUNT_KEY that contains my Firebase's credentials in Render's Environment Variable so that the Cloud Database Firebase can communicate with my App's backend.
 - Added CRUD so I can alter the data from the Firebase Database via the express backend requests
 - Frontend will be using URL [BeliBijak Frontend](https://belibijak.onrender.com/)
 - Express backend will be using URL [BeliBijak Frontend](https://belibijak-1.onrender.com)
 - Added CORS to handle the permission errors from the browser when retrieving data from database
 - Added a Dark Mode feature in the settings

## Running the app

- Step 1: Install the dependencies:

  ```
  npm install
  ```

- Step 2: Start the backend server:

  ```
  node .\backend\server.js
  ``

- Step 3: In another terminal, Start the Frontend React app:

  ```
  (in another terminal)
  npm start
  ```

- Build and run iOS and Android development builds:

  ```
  npm run ios
  # or
  npm run android
  ```

- In the terminal running the development server, press `i` to open the iOS simulator, `a` to open the Android device or emulator, or `w` to open the web browser.

## API Endpoints

### Users
- **GET /users**: Retrieve a list of users.
- **POST /users**: Create a new user with a name and email.

### Stores
- **GET /stores**: Retrieve a list of grocery stores.
- **POST /stores**: Create a new grocery store with a name.
- **PUT /stores/:id**: Update the name of a grocery store by ID.
- **DELETE /stores/:id**: Delete a grocery store by ID.

## Deployment to Render

### Frontend React Native App using Render Web Service
- [BeliBijak Frontend web app](https://belibijak.onrender.com/)

### Express Backend URL to retrieve Database from Firebase + Using Render Web Service
- [BeliBijak Backend](https://belibijak-1.onrender.com)

## Resources

- [Sharif's Github Page](https://github.com/sharifuddin707/BeliBijak)
- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)
- [React Native Starter template](https://reactnative.dev/docs/navigation#react-navigation)
- [Cloud Database Firebase](https://firebase.google.com/)
- [Render App Deployment](https://render.com/)

