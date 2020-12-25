import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Card, ProgressCircular } from 'ui-neumorphism'
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
    
    const [loaded, setLoaded] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    setTimeout(() => {
        setLoaded(true);
    }, 500 ) 

    useEffect(()=>{
        THEMECOLOR = 'theme1'
        overrideThemeVariables(theme(THEMECOLOR))
    },[])

    const themeModeToggle = () => {
        DARKMODE = !darkMode;
        setDarkMode(!darkMode)
        overrideThemeVariables(theme(THEMECOLOR))
    }

    const changeTheme = (colorName) => {
        THEMECOLOR = colorName
        overrideThemeVariables(theme(THEMECOLOR))
    }
    

    return (
        <main className={`theme--${DARKMODE ? 'dark' : 'light'}`}>
            <Card
                flat
                dark={DARKMODE}
                className={`main-container ${isSmall ? 'main-container-sm' : ''}`} 
                style={{borderRadius:'0px'}}>

            {!loaded?
                <div style={styles.center} className={`theme--${DARKMODE ? 'dark' : 'light'}`} >                  
                    <ProgressCircular dark={DARKMODE} indeterminate size={64} width={8} color='var(--error)' />
                </div>
            :
            
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
                              
            }
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