import React from 'react';
import 八卦 from"../assets/icons/bagua.png"
import {Link, NavLink} from "react-router-dom";
import * as routes from "../routes";

function Header({account}) {
    const hideAccountDetail=(id)=>{
        return id.substring(0,5)+"......"+id.substring(id.length-3)
    }
    return (

        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={routes.HOME}>
                    <img src={八卦} alt="" width="40" height="40"/>
                </Link>
                <NavLink className="navbar-text" to={routes.ACCOUNT}>
                    {account&&hideAccountDetail(account)}
      </NavLink>
            </div>
        </nav>

);
}

export default Header;