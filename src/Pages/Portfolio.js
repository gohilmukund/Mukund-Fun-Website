import React, { Component } from 'react'
import { Button } from 'ui-neumorphism'
import Header from '../Components/Header'

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
        <div style={{width:'100%'}}> 
            {/* {!this.state.loaded? */}
                {/* <div style={styles.center}>                   */}
                    {/* <ProgressCircular indeterminate size={64} width={8} color='var(--error)' />
                </div> 
            :
                <div style={styles.center}>       
    <Card bordered style={styles.mainContainer}> */}
                        <Header title='Portfolio' />
                        <Button > Welcome To Mk's World </Button>
                    {/* </Card>
                    <Footer title="hello"/>
                </div> */}
            {/* } */}
        </div>
    )
  }
}

// const styles = {
//     center: {
//         alignItems:'center', // Vertical
//         height:'100vh', 
//         display: 'flex', 
//         justifyContent: 'center', // Horizontal 
//         flexDirection:'column'
//     },
//     mainContainer: {
//         alignItems:'center', // Horizontal
//         flexDirection:'column',
//         width:'95vw', 
//         height:'90vh', 
//         display: 'flex', 
//         // justifyContent: 'center', // Vertical 
//     },
//   }

export default Portfolio ;