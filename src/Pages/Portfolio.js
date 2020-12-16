import React, { Component } from 'react'

import { Button, Card, ProgressCircular } from 'ui-neumorphism'
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
        }, 3000 )
    
    return( 
        <div> 
            {!this.state.loaded?
                <div style={styles.center}>                  
                    <ProgressCircular indeterminate size={64} width={8} color='var(--error)' />
                </div> 
            :
                <div style={styles.center}>         
                    <Card bordered style={styles.mainContainer}>      
                        <Button style={{color:'red'}}> Welcome </Button>
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
        alignItems:'center', // Vertical
        width:'95vw', 
        height:'90vh', 
        display: 'flex', 
        justifyContent: 'center', // Horizontal 
    }
  }

export default Portfolio ;