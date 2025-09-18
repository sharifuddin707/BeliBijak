# BeliBijak App in Development

This is an app that will use a navigation starter template for React Native apps using Expo and React Navigation. It is still in development

## App Architecture

 - React Native Frontend + Express Backend + NodeJs + Cloud Firebase Database

 NOTE IMPORTANT!!!: If you did not see any displayed data in the Home screen, it means the backend is not on. Start the Backend Server first, follow the ## Running the app.

## Update from previous Assignment 2

 - I moved the Profile and Setting buttons to the navigation tabs
 - Connected the Frontend React Native app to the express backend which will handle all the requests
 - Connected my backend to my Cloud Firebase Database. (So my app will need internet connection to retrieved the data)
 - Added CRUD so I can alter the data from the Firebase Database via the express backend requests
 - Frontend will be using port [localhost:8081](http://localhost:8081/)
 - Express backend will be using port [localhost:3000](http://localhost:3000/stores)
 - Added CORS to handle the permission errors from the browser when retrieving data from database

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

## Resources

- [React Navigation documentation](https://reactnavigation.org/)
- [Expo documentation](https://docs.expo.dev/)
- [React Native Starter template]{https://reactnative.dev/docs/navigation#react-navigation}

