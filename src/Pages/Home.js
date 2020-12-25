import React from 'react';
import '../Styles/App.css';
import '../Styles/star.css';
import pine from '../assets/Images/pine.png'

const button = () => {
  return(
    <a href="/Portfolio">
    <div id="btn" onClick={()=>"#text"} >
      <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div>
      
      <div id='btntext' > Let's Dive In</div>
      {/* <Link to="/Portfolio">Let's Dive</Link> */}
    </div>
    </a>
  )
}

const Home = () => (
  <div>
      <div style={{position:"absolute", bottom:0, backgroundImage:`url(${pine})`, backgroundRepeat:'repeat-x', width:'100vw', height:'25vh' }}>
       
      </div>
    
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
