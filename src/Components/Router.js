import React, { useState, useEffect } from "react";
import { findDOMNode } from "react-dom";
import { Route, Switch, withRouter} from "react-router-dom";
import { Card, overrideThemeVariables } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import Footer from '../Components/Footer'
import routes from '../routes/index.js'
import Header from "./Header";
import { theme } from "./Theme";
import Tilt from 'react-parallax-tilt';

export let isSmall = false ;

function NeumorphicRoute() {

    var mainView = null;
    console.log(mainView)
    
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode")==="true" ?  true : false)
    const [themeColor, setThemeColor] = useState(localStorage.getItem("theme"))

    useEffect(()=>{
        overrideThemeVariables(theme(themeColor))
    },[themeColor])
    
    const themeModeToggle = () => {    
        const DARKMODE=!darkMode   
        setDarkMode(DARKMODE)  
        localStorage.setItem("darkMode", DARKMODE)
    }

    function changeTheme(colorName) {   
        localStorage.setItem("theme", colorName)
        localStorage.setItem("darkMode", darkMode)
        setDarkMode(darkMode)
        setThemeColor(colorName)
        overrideThemeVariables(theme(colorName))
    }
    

    return (        
        <main className={`theme--${darkMode ? 'dark' : 'light'}`}>
            <Card
                flat
                dark={darkMode}
                className={`main-container ${isSmall ? 'main-container-sm' : ''}`} 
                style={{borderRadius:'0px'}}>
                        
                <div style={styles.center}>       
                    <Tilt 
                        tiltReverse 
                        gyroscope 
                        trackOnWindow
                        className="parallax-effect-bg"
                        tiltMaxAngleX={40}
                        tiltMaxAngleY={40}
                        perspective={800}
                        transitionSpeed={1500}
                        scale={1.1} 
                    >
                    <Card bordered dark={darkMode} style={styles.mainContainer}>
                        <Header dark={darkMode} onClick={themeModeToggle} />
                        <Card 
                            flat
                            id='mainView'   
                            style={{width:'100%',height:'100%', maxHeight:'100%'}}
                            ref={(ref) => (mainView = findDOMNode(ref))}
                            className={`main-view main-view--${
                            !isSmall ? 'large' : 'small' }`}
                            >
                            <Switch>
                                {routes.map((route) => (
                                    <Route
                                        exact
                                        key={route.id}
                                        path={route.path}
                                        component={() => <route.component dark={darkMode} />}
                                    />
                                ))}
                            </Switch>
                        </Card>                   
                    </Card>
                    </Tilt>
                    <Footer onClick={changeTheme} dark={darkMode}/>
                </div>
                
            {/* } */}
            </Card>
        </main>
    )
}

const styles = {
    center: {
        alignItems:'center', // Vertical
        height:'100vh', 
        display: 'flex', 
        justifyContent: 'center', // Horizontal 
        flexDirection:'column'
    },
    mainContainer: {
        alignItems:'center', // Horizontal
        flexDirection:'column',
        width:'80vw', 
        height:'90vh', 
        display: 'flex', 
        // marginLeft:'10vw', 
        // marginRight:'10vw'
        // justifyContent: 'center', // Vertical 
    },
}

export default withRouter(NeumorphicRoute)