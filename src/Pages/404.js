import React from 'react';
// import logo from '../assets/Images/logo.svg';
import '../Styles/style404.css';

const Page404 = () => 
{
    const goBack = () => {
        window.history.back();
        console.log("Hello")
    }

    return(
        <div style={{minHeight:'100vh'}} className="body">
            <div className="noise"></div>
            <div className="overlay"></div>
            <div className="terminal">
                <h1>Error <span class="errorcode">404</span></h1>
                <p className="output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
                <p className="output">Please try to 
                    <button onClick={goBack} className="link">go back</button> or 
                    <button className="link" href="index.html">return to the homepage</button>.
                </p>
                <p className="output">Good luck.</p>
            </div>           
            
        </div>
        );
}


export default Page404;
