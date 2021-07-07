import React from 'react';
import Web3 from "web3";
import {Container} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import * as routes from "../routes";

function Account({account,balance}) {

    return (
        (!account||!balance)?<Redirect  to={routes.ERROR}/>:
    <Container >
        <h3>{Web3.utils.fromWei(balance)} BNB</h3>

    </Container>
    );
}

export default Account;