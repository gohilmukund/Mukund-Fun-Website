import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Card, ProgressCircular, overrideThemeVariables } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import page404 from "../Pages/page404";
import Portfolio from "../Pages/Portfolio";
import Header from '../Components/Header'
import Footer from '../Components/Footer'

export default function NeumorphicRoute() {
    
    const [loaded, setLoaded] = useState(false)
    setTimeout(() => {
        setLoaded(true);
    }, 500 )

    // useEffect(()=> {
    //     overrideThemeVariables({
    //         '--light-bg': '#E9B7B9',
    //         '--light-bg-dark-shadow': '#ba9294',
    //         '--light-bg-light-shadow': '#ffdcde',
    //         '--dark-bg': '#292E35',
    //         '--dark-bg-dark-shadow': '#21252a',
    //         '--dark-bg-light-shadow': '#313740',
    //         '--primary': '#8672FB',
    //         '--primary-dark': '#4526f9',
    //         '--primary-light': '#c7befd'
    //       })
    // });

    return (
        <div>
            {!loaded?
                <div style={styles.center}>                  
                    <ProgressCircular indeterminate size={64} width={8} color='var(--error)' />
                </div>
            :
                <div style={styles.center}>       
                    <Card bordered style={styles.mainContainer}>
                        <div style={{width:'100%',height:'90vh'}}>
                            <Switch>
                                <Route path="/portfolio" component={Portfolio} />
                                <Route path="/about" component={About} />      
                                <Route path="*" component={page404} /> 
                            </Switch>
                        </div>
                    </Card>
                    <Footer title="hello"/>
                </div>
            }
        </div>
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

function About() {
    return (
      <div style={{width:'100%'}}>
          <Header title='About'/>
        <h2>About</h2>
      </div>
    );
  }
  