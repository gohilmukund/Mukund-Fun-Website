import React from 'react'
import { Avatar, Body1,  } from 'ui-neumorphism'
import pro from '../assets/Images/propic.jpg'

const AboutMe = (props) => {
    const {dark} = props
    return(
        <div style={{width:'100%',height:'100%'}}>
            <div class='justify-content-center align-items-center' style={{height:'100%', paddingTop:'5%' , justifyContent:'center', alignItems:'center' }}> 

                <div style={{width:'100%',  alignContent:'center', justifyContent:'center', display:'flex'}}>
                    <Avatar size='200' />
                    <Avatar size='150' src={pro} style={{position:'absolute', margin:'25px'}} />
                </div>
                

                <Body1 dark={dark} style={{height:'100%',paddingTop:'10px', paddingLeft:'10%', paddingRight:'10%', textAlign:'center',}}>
                    Mukund has always been a Windows lover ever since he got his 
                    hands on her first Windows XP PC. He have used all the versions of Windows, even windows 3.1. 
                    He have always been enthusiastic about technological stuff, 
                    especially Internet of Things. Before joining Atos, he worked as a freelancer, technician and 
                    worked on numerous technical projects.
                </Body1>
            </div>
                
        </div>
    )
}

export default AboutMe