import React from 'react'
import { Button, Divider } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import routes from '../routes/index.js'
import Topbar from './Topbar';
import { DARKMODE } from './Router';

const buttonRender = (item) => {
    return (
        <Button key={item.id} dark={DARKMODE} text onClick={()=>window.location.href=item.path}>{item.name}</Button> 
    )
}

export default function Header(props) {

    // const darkModeToggle = () => {
    //     DARKMODE = !DARKMODE;
    //     overrideThemeVariables(theme('pink'))
    //     // setDarkMode(!darkMode)        
    // }   

    return (
        <div style={styles.headerStyle}  >
            <Topbar
                size={"100%"}
                dark={DARKMODE}
                onClick={props.onClick}
                // onMenuClick={this.toggleSidebar}
                />
            {/* <div>
                <H1 dark={DARKMODE} >Mukund's {props.title}</H1>
            </div> */}
            <div> 
                {routes.map((item)=>buttonRender(item))}
                {/* <Button dark={DARKMODE} text onClick={()=>window.location.href='/Home'}>Home</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/Portfolio'}>Portfolio</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/Skills'}>Skills</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/Achievements'}>Achievements</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/Certification'}>Certifications</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/About'}>About Me</Button> 
                <Button dark={DARKMODE} text onClick={()=>window.location.href='/Contact'}>Contact Me</Button>  */}
            </div>
            <Divider elevated dark={DARKMODE} style={{width:'100%'}} />
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