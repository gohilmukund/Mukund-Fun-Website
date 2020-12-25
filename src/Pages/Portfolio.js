import React from 'react';
// import logo from '../assets/Images/logo.svg';
import '../Styles/stylesheet.css';
// import './particlebanner'
import ParticleAnimation from 'react-particle-animation'

const Portfolio = () => (
    <div style={{width:'100vw', height:'100vh' }}>
        <ParticleAnimation numParticles={500}
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
            }} 
        />
    
  
    </div>
);


export default Portfolio;
