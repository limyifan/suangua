import React from 'react';
import {Container} from "react-bootstrap";
import warning from"../assets/icons/warning.png"
import {Link} from "react-router-dom";
import * as routes from "../routes";

function Error() {
    return (
        <Container style={{paddingTop:"5%"}}>
           <li>< img src={warning} height={"150vh"}alt={"error logo"}/></li>
            <h1>Bad Request</h1>
            <li>
                <Link to={routes.HOME}>
                   返回首页
                </Link>
            </li>
        </Container>
    );
}

export default Error;