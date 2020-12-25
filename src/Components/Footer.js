import React from 'react'
import { Card, Overline, IconButton } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import { DARKMODE } from './Router'


export default function Footer(props) {
    return (
        <div style={{marginTop:'10px'}}>
            <Overline dark={DARKMODE}> 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>
                    Website made by Mukund Gohil 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>  
            </Overline>
            <Card inset dark={DARKMODE} className='d-flex align-center topbar-actions' style={{padding:'5px',alignContent:'center',display: 'flex', justifyContent: 'center',}}>  
                <IconButton bordered bgColor={DARKMODE?'#3E3D42':'#D6DDFB'} size="small" onClick={()=>props.onClick('theme1')}> </IconButton>
                <IconButton bordered bgColor={DARKMODE?'#444444':'#E4EBF5'} size="small" onClick={()=>props.onClick('theme2')}> </IconButton>
                <IconButton bordered bgColor={DARKMODE?'#515568':'#E9B7B9'} size="small" onClick={()=>props.onClick('theme3')}> </IconButton>
                <IconButton bordered bgColor={DARKMODE?'#243441':'#B9D7D2'} size="small" onClick={()=>props.onClick('theme4')}> </IconButton>
                <IconButton bordered bgColor={DARKMODE?'#292E35':'#cccccc'} size="small" onClick={()=>props.onClick('theme5')}> </IconButton>
                {/* <IconButton bordered bgColor='#3E3D42' size="small" onClick={()=>props.onClick('dark2')}> </IconButton>
                <IconButton bordered bgColor='#243441' size="small" onClick={()=>props.onClick('dark3')}> </IconButton>
                <IconButton bordered bgColor='#515568' size="small" onClick={()=>props.onClick('dark4')}> </IconButton>    */} 
            </Card>
        </div>
    )
}