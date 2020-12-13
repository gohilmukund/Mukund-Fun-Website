import React from 'react';
import { Link } from 'react-router-dom';
// import logo from '../assets/Images/logo.svg';
import '../Styles/App.css';
import '../Styles/star.css';

const button = () => {
  return(
    <Link to="/Portfolio">
    <div id="btn" onClick={()=>"#text"} >
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      
      <a id='btntext'  > Let's Dive In</a>
      {/* <Link to="/Portfolio">Let's Dive</Link> */}
    </div>
    </Link>
  )
}

const Home = () => (
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
          </div>
          <div id='description'>
            <span>
              I am Not Perfect, but I am a Limited Edition
            </span>
          </div>
          
            {button()}
      
    </div>

  </div>
);

export default Home;
