import React from 'react';
// import logo from '../assets/Images/logo.svg';
import Portfolio from './Portfolio'
import '../Styles/App.css';
import '../Styles/star.css';
import '../Styles/stylesheet.css';
import Page404 from './404';

const App = () => (
  <div>
    
    
    <div id='container' style={{height:"100vh", width:"100vw", overflow:"hidden"}} >
        <link href='https://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
        <div id='stars'></div>
        <div id='stars2'></div>
        <div id='stars3'></div>
        <div id='title'>
          <span class='center'>
            Hello, I am MUKUND GOHIL
          </span>         
        </div>
        <div class='center' style={{bottom:'20vh',position:'absolute', width:'100vw'}}>
          <a href="#text" style={{bottom:'10vh', height:'50px'}} class="btn btn-outline-primary center">View my Accomplishment</a>
        </div>
    </div>

    <div id="text">
        <Portfolio />
    </div>

    <div>
      <Page404 />
    </div>

    
 

  </div>
);


export default App;
