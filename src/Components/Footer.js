import React from 'react'
import { Overline } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'


export default function Footer() {
    return (
        <div style={{marginTop:'10px'}}>
            <Overline> 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>
                Website made by Mukund Gohil 
                <span role="img" aria-label="heart"> &#10084;&#65039; </span>
            </Overline>
        </div>
    )
}