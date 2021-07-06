import React from 'react';
import 八卦 from"../assets/icons/bagua.png"
function Header(props) {
    return (

        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={八卦} alt="" width="40" height="40"/>
                </a>
                <span className="navbar-text">
       Account
      </span>
            </div>
        </nav>

);
}

export default Header;