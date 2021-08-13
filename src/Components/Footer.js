import React from 'react'
import { withRouter } from 'react-router'
import { Card, Overline, IconButton } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import { themeIndex } from './Theme'

function Footer(props) {
    const {dark} = props
    return (
        <div style={{bottom:10, paddingBottom:'10px' }}>
            <Overline dark={dark}> 
                    <span role="img" aria-label="heart"> &#10084;&#65039; </span>
                        Website made by Mukund Gohil 
                    <span role="img" aria-label="heart"> &#10084;&#65039; </span>  
                </Overline>
            <Card inset dark={dark} className='d-flex align-center topbar-actions' style={{padding:'5px',alignContent:'center',display: 'flex', justifyContent: 'center',}}> 
                {themeIndex.map((item)=>{
                    return(
                        <IconButton key={item.name} bordered bgColor={dark?item.dark:item.light} size="small" onClick={()=>props.onClick(item.name)}> </IconButton>
                    )
                })}            
            </Card>
        </div>
    )
}


export default withRouter(Footer)