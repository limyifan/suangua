import React from 'react';
import 八卦 from "../assets/icons/logo.png"
import {Link, NavLink} from "react-router-dom";
import * as routes from "../routes";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useSnackbar} from "notistack";
import web3 from "web3";

function Header({cbcContract, account}) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const TOKEN_ADDRESS = '0x7139b4A901b9147d5715Cc7b715337Cf295e5235';

    const hideAccountDetail = (id) => {
        return id.substring(0, 5) + "......" + id.substring(id.length - 3)
    }
    const mintToken = async () => {
        if (window.ethereum) {

            await cbcContract.methods.mint(web3.utils.toWei("1000", "ether")).send({from: account})
                .on('transactionHash', function (hash) {
                    console.log(hash)
                    enqueueSnackbar(`Transaction Pending...`, {
                        variant: 'info', persist: true,
                    })
                })
                .on('receipt', function (receipt) {
                    console.log(receipt)
                    if (receipt) {
                        closeSnackbar()
                        enqueueSnackbar("Token mint successfully", {
                            variant: 'success',
                            autoHideDuration: 3000,
                        });
                    }
                })//mint token initially
                .on('error', function (e, receipt) {
                    switch (e.code) {
                        case(4001):
                            enqueueSnackbar(`Transaction rejected by user`, {
                                variant: 'error',
                                autoHideDuration: 3000,
                            })
                            break

                        default:
                            closeSnackbar()
                            enqueueSnackbar("Failed to mint token", {
                                variant: 'error',
                            })
                            break
                    }
                });

        } else {
        }
    }

    const addTokenToWallet = async () => {
        if (window.ethereum) {
            window.ethereum
                .request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: TOKEN_ADDRESS, // The address that the token is at.
                            symbol: 'CBC', // A ticker symbol or shorthand, up to 5 chars.
                            decimals: 18, // The number of decimals in the token
                            image: 'https://image.flaticon.com/icons/png/512/2927/2927910.png', // A string url of the token logo
                        },
                    },
                })
                .then(res => {
                    console.log(res)
                    if (res) {
                        enqueueSnackbar("Token added successfully", {
                            variant: 'success',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right',
                            },
                        });
                    } else {
                        enqueueSnackbar("Failed to add token", {
                            variant: 'error',
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'right',
                            },
                        });
                    }
                })
                .catch(() => enqueueSnackbar("Failed to add token", {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                }))
        } else {
        }
    }

    return (
        <Navbar className="navbar navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to={routes.HOME}>
                    <img src={八卦} alt="" width="40" height="40"/>
                    <span>&nbsp;&nbsp;算卦选币</span>
                </Link>
                {account && cbcContract && <Nav>
                    <NavDropdown title={account && hideAccountDetail(account)} id="basic-nav-dropdown">
                        <NavDropdown.Item><NavLink to={routes.ACCOUNT}>View Account
                            Details</NavLink></NavDropdown.Item>
                        <NavDropdown.Item onClick={mintToken}>Mint CBC Token</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={addTokenToWallet}>Add CBC Token to Wallet</NavDropdown.Item>
                    </NavDropdown>
                </Nav>}

            </div>
        </Navbar>

    );
}

export default Header;