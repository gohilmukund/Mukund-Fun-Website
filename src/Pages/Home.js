import React from 'react';
// import logo from '../assets/Images/logo.svg';
import '../Styles/App.css';
import '../Styles/star.css';

const App = () => (
  <div>
    
      <div id='container' style={{height:"100vh", overflow:"hidden"}} >
          <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
          <div id='stars'></div>
          <div id='stars2'></div>
          <div id='stars3'></div>
          <div id='title'>
            <span>
              MUKUND GOHIL
            </span>
            <br />
            <span>
              &
            </span>
            <br />
            <span>
              KHUSHBU SOLANKI
            </span>
            <br />
            <a type="button" href="#text" > Hello </a>
          </div>
      
    </div>

    <div id="text" height='100vh'>
        <h1> Hello World</h1>
    </div>

  </div>
);

export default App;
