import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import Navigation from './Components/Navigation';

const firebaseConfig = {
  apiKey: "AIzaSyDat7NFSCyGQs801U5rIVm66euKgr12AT4",
  authDomain: "mukund-fun.firebaseapp.com",
  databaseURL: "https://mukund-fun.firebaseio.com",
  projectId: "mukund-fun",
  storageBucket: "mukund-fun.appspot.com",
  messagingSenderId: "575650076396",
  appId: "1:575650076396:web:623b6b2bb7ee5a39b2b7c9",
  measurementId: "G-RJ6MKGVXX4"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <Navigation />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
