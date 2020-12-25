import React from 'react'
import { Card, Overline, IconButton } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import { DARKMODE } from './Router'
import { themeIndex } from './Theme'


export default function Footer(props) {
    return (
        <div style={{marginTop:'10px'}}>
            <Overline dark={DARKMODE}> 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>
                    Website made by Mukund Gohil 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>  
            </Overline>
            <Card inset dark={DARKMODE} className='d-flex align-center topbar-actions' style={{padding:'5px',alignContent:'center',display: 'flex', justifyContent: 'center',}}> 

                {themeIndex.map((item)=>{
                    return(
                        <IconButton bordered bgColor={DARKMODE?item.dark:item.light} size="small" onClick={()=>props.onClick(item.name)}> </IconButton>
                    )
                })}            
            </Card>
        </div>
    )
}