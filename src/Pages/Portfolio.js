import React, { Component } from 'react'

import { Button, Card, Divider, H1, ProgressCircular } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'

class Portfolio extends Component {

    constructor(props){
        super(props);
        this.state = {
            loaded: false
        }
    }

  render() {

        setTimeout(() => {
            this.setState({loaded:true});
        }, 1000 )
    
    return( 
        <div> 
            {!this.state.loaded?
                <div style={styles.center}>                  
                    <ProgressCircular indeterminate size={64} width={8} color='var(--error)' />
                </div> 
            :
                <div style={styles.center}>         
                    <Card bordered style={styles.mainContainer}>     
                        <div>
                            <H1>Mukund's Portfolio</H1>
                        </div>
                        <div> 
                            <Button text>Home</Button> 
                            <Button text>Portfolio</Button> 
                            <Button text>Skills</Button> 
                            <Button text>Achievements</Button> 
                            <Button text>Certifications</Button> 
                            <Button text>About Me</Button> 
                            <Button text>Contact Me</Button> 
                            {/* <Button text></Button> */}
                        </div>
                        <Divider elevated style={{width:'100%'}} />
                        <Button > Welcome To Mk's World </Button>
                    </Card>   
                </div>
            }
        </div>
    )
  }
}

const styles = {
    center: {
        alignItems:'center', // Vertical
        height:'100vh', 
        display: 'flex', 
        justifyContent: 'center', // Horizontal 
    },
    mainContainer: {
        alignItems:'center', // Horizontal
        flexDirection:'column',
        width:'95vw', 
        height:'90vh', 
        display: 'flex', 
        // justifyContent: 'center', // Vertical 
    }
  }

export default Portfolio ;