import React from 'react'
import { Button, Divider, H1 } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'


export default function Header(props) {
    return (
        <div style={styles.headerStyle}>
            <div>
                <H1>Mukund's {props.title}</H1>
            </div>
            <div> 
                <Button text onClick={()=>window.location.href='/Home'}>Home</Button> 
                <Button text onClick={()=>window.location.href='/Portfolio'}>Portfolio</Button> 
                <Button text onClick={()=>window.location.href='/Skills'}>Skills</Button> 
                <Button text onClick={()=>window.location.href='/Achievements'}>Achievements</Button> 
                <Button text onClick={()=>window.location.href='/Certification'}>Certifications</Button> 
                <Button text onClick={()=>window.location.href='/About'}>About Me</Button> 
                <Button text onClick={()=>window.location.href='/Contact'}>Contact Me</Button> 
            </div>
            <Divider elevated style={{width:'100%'}} />
        </div>
    )
}

const styles = {    
    headerStyle: {
        width:'100%', 
        display: 'flex', 
        flexDirection:'column', 
        alignItems: 'center',
    }
}