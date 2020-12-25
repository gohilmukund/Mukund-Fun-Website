import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Card } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import Footer from '../Components/Footer'
import routes from '../routes/index.js'
import Header from "./Header";
import { overrideThemeVariables } from 'ui-neumorphism'
import { theme } from "./Theme";
import { withRouter } from 'react-router-dom'

export var DARKMODE = false;
export let THEMECOLOR ;
export let isSmall = false ;

function NeumorphicRoute() {
    
    const [darkMode, setDarkMode] = useState(false)   

    window.onload = checkTheme();
    function checkTheme() {
        const localStorageTheme = localStorage.getItem("theme");        
        if(localStorageTheme !== null) {
            THEMECOLOR = localStorageTheme
        }
    }

    useEffect(()=>{
        console.log("Theme: ", localStorage.getItem("darkMode"), localStorage.getItem("theme") )
    })
    

    useEffect(()=>{        
        const localStorageDarkMode = localStorage.getItem("darkMode");
        DARKMODE=localStorageDarkMode
        setDarkMode(localStorageDarkMode)
        overrideThemeVariables(theme(THEMECOLOR))
    },[])

    const themeModeToggle = () => {        
        DARKMODE = !darkMode;
        setDarkMode(!darkMode)
        localStorage.setItem("darkMode", DARKMODE)
    }

    const changeTheme = (colorName) => {
        THEMECOLOR = colorName
        localStorage.setItem("theme", colorName)
        overrideThemeVariables(theme(THEMECOLOR))        
    }
    

    return (
        <main className={`theme--${DARKMODE ? 'dark' : 'light'}`}>
            <Card
                flat
                dark={DARKMODE}
                className={`main-container ${isSmall ? 'main-container-sm' : ''}`} 
                style={{borderRadius:'0px'}}>
                        
                <div style={styles.center}>       
                    <Card bordered dark={DARKMODE} style={styles.mainContainer}>
                        <Header onClick={themeModeToggle} />
                        <div style={{width:'100%',height:'90vh'}}>
                            <Switch>
                                {routes.map((route) => (
                                    <Route
                                        exact
                                        key={route.id}
                                        path={route.path}
                                        component={() => <route.component dark={DARKMODE} />}
                                    />
                                ))}
                            </Switch>
                        </div>
                    </Card>
                    
                    <Footer onClick={changeTheme} />
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