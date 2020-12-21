import React from 'react'
import { H3 } from 'ui-neumorphism'
import Header from '../Components/Header'

const page404 = () => {
    return(
        <div style={{width:'100%',height:'100%'}}>
            <Header title="404"/>
            <div style={{height:'100%', justifyContent:'center' }}> 
                <H3 style={{height:'100%', textAlign:'center',}}>The page you are trying to access is not found.</H3>
            </div>
                
        </div>
    )
}

export default page404