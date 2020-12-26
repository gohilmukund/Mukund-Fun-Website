import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Card } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import Footer from '../Components/Footer'
import routes from '../routes/index.js'
import Header from "./Header";
import { overrideThemeVariables } from 'ui-neumorphism'
import { theme } from "./Theme";
import { withRouter } from 'react-router-dom'

export let isSmall = false ;

function NeumorphicRoute() {
    
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode")==="true" ?  true : false)
    const [themeColor, setThemeColor] = useState(localStorage.getItem("theme")? localStorage.getItem("theme") :'christmas')

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
                    <Card bordered dark={darkMode} style={styles.mainContainer}>
                        <Header dark={darkMode} onClick={themeModeToggle} />
                        <div style={{width:'100%',height:'90vh'}}>
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
                        </div>
                    </Card>
                    
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
        width:'95vw', 
        height:'90vh', 
        display: 'flex', 
        // justifyContent: 'center', // Vertical 
    },
}

export default withRouter(NeumorphicRoute)