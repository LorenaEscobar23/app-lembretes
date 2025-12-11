import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBUXaghb1jEjpojzA7TqapwgQK6aFOm36Y",
  authDomain: "app-lembretes-55c7d.firebaseapp.com",
  projectId: "app-lembretes-55c7d",
  storageBucket: "app-lembretes-55c7d.firebasestorage.app",
  messagingSenderId: "663983659382",
  appId: "1:663983659382:web:f8476b4049aa882c6d8257",
  databaseURL: "https://app-lembretes-55c7d-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
