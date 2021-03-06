import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./headerComponent/header";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Home from "./homeComponent/home";
import Switch from "react-bootstrap/Switch";
import * as routes from "./routes";
import {Component} from "react";
import {networkSetup} from "./network";
import Web3 from 'web3';
import Account from "./accountComponent/account";
import Error from "./errorComponent/error";
import CBC from "../src/abis/CBC.json"
import Gua from "../src/abis/Gua.json"
import {SnackbarProvider} from "notistack";
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            web3: 'undefined',
            account: '',
            token: null,
            cbcContract: null,
            cbcContractAddress: null ,
            guaContract: null,
            guaContractAddress: null
        }
    }

    async componentWillMount() {
        await networkSetup()
        await this.loadBlockchainData(this.props.dispatch)
    }

    async loadBlockchainData() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload()
            })

            const web3 = new Web3(window.ethereum)
            await window.ethereum.enable(); //connect Metamask
             const netId = await web3.eth.net.getId()
            const accounts = await web3.eth.getAccounts()
            //load balance
            if (typeof accounts[0] !== 'undefined') {
                const balance = await web3.eth.getBalance(accounts[0])
                this.setState({account: accounts[0], balance: balance, web3: web3})
            } else {
                window.alert('Please login with MetaMask')
            }

            //load contracts
            try {
                const cbcContract = new web3.eth.Contract(CBC.abi, CBC.networks[netId].address)
                const cbcContractAddress = CBC.networks[netId].address
                this.setState({cbcContract: cbcContract, cbcContractAddress: cbcContractAddress})

            } catch (e) {
                console.log('Error', e)
                window.alert('CBC Contracts not deployed to the current network')
            }

            try {
                const guaContract = new web3.eth.Contract(Gua.abi, Gua.networks[netId].address)
                const guaContractAddress = CBC.networks[netId].address
                this.setState({guaContract:guaContract,guaContractAddress:guaContractAddress})
            } catch (e) {
                console.log('Error', e)
                window.alert('Gua Contracts not deployed to the current network')
            }

        } else {
            window.alert('Please install MetaMask')
        }
    }
    render() {
        return (
            <SnackbarProvider >
            <div className="App">
                <BrowserRouter>
                    <Header account={this.state.account} cbcContract={this.state.cbcContract}/>
                    <Switch>
                        <Route  exact path={routes.HOME} render={()=><Home account={this.state.account} cbcContract={this.state.cbcContract} guaContract={this.state.guaContract} />}/>
                        <Redirect path={"*"} component={Home}/>
                        <Route  exact path={routes.ACCOUNT} render={()=><Account account={this.state.account} balance={this.state.balance}/>}/>
                        <Route  exact path={routes.ERROR} component={Error}/>
                    </Switch>
                </BrowserRouter>
            </div>
            </SnackbarProvider>
        );
    }
}

export default App;
