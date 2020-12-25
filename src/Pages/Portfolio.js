import React from 'react';
// import logo from '../assets/Images/logo.svg';
import '../Styles/stylesheet.css';
// import './particlebanner'
import ParticleAnimation from 'react-particle-animation'


import { Button } from 'ui-neumorphism'

export const OldPortfolio = () => (
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

const Portfolio = () => {
    return(
        <div style={{width:'100%',height:'100%'}}>
            <div style={{width:'100%'}}> 
                <Button > Welcome To Mk's World </Button>
            </div>
                
        </div>
    )
}

export default Portfolio ;
