import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { Card, ProgressCircular } from 'ui-neumorphism'
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

    return (
        <div>
            {!loaded?
                <div style={styles.center}>                  
                    <ProgressCircular indeterminate size={64} width={8} color='var(--error)' />
                </div> 
            :
                <div style={styles.center}>       
                    <Card bordered style={styles.mainContainer}>
                        
                        <Switch>
                            <Route path="/portfolio" component={Portfolio} />
                            <Route path="/about" component={About} />      
                            <Route path="*" component={page404} /> 
                        </Switch>
                        
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
  