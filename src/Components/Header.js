import React from 'react'
import { Button, Divider } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'
import routes from '../routes/index.js'
import Topbar from './Topbar';
import { useLocation, withRouter } from 'react-router';

const buttonRender = (item, location, dark) => {    
    const active = item.path===location.pathname
    if (item.id===100)
        return null;
    else
        return (
            <Button active={active} key={item.id} dark={dark} text onClick={()=>window.location.href=item.path}>
                {item.name}
            </Button> 
        )
}

function Header(props) {

    const location = useLocation();
    const {dark} = props
    
    return (
        <div style={styles.headerStyle}  >
            <Topbar
                size={"100%"}
                dark={dark}
                onClick={props.onClick}
                />

            <div> 
                {routes.map((item)=>buttonRender(item, location, dark))}
            </div>

            <Divider elevated dark={dark} style={{width:'100%'}} />
        </div>
    )
}

const styles = {    
    headerStyle: {
        width:'100%', 
        display: 'flex', 
        flexDirection:'column', 
        alignItems: 'center',
    }
}


export default withRouter(Header)