import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Container } from 'react-bulma-components';
import {
  Switch,
  Route,
} from "react-router-dom";

import { Button,Modal} from 'react-bootstrap';

import Home from './Pages/Home';
import AllItems from './Pages/AllItems';
import About from './Pages/About';

import Navigation from './Components/Navigation';

import SmartProperty from './abis/SmartProperty.json';
import ContractEstate from './abis/ContractEstate.json';
import PropertySell from './Pages/PropertySell';

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3()
   
    
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      await this.loadBlockchainData();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      await this.loadBlockchainData();
    }
    else {
      this.setState({show:true});
      this.setState({message:'Install the Chrome MetaMask Extension to proceed!'});
      this.setState({dialogTitle:'MetaMask Not Found'});
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const smartPropertyMarketData = SmartProperty.networks[networkId];
    const contractEstateData = ContractEstate.networks[networkId];

    if(smartPropertyMarketData) {
      const smartPropertyMarket = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);
      this.setState({ smartPropertyMarket });
    } else {
      this.setState({show:true});
      this.setState({message:'Contract not deployed on select network. Switch to RINKEBY'});
      this.setState({dialogTitle:'Smart Contract not found'});
    }

    if(contractEstateData) {
      const contractEstate = new web3.eth.Contract(ContractEstate.abi, contractEstateData.address);
      this.setState({ contractEstate });
    } else {
      this.setState({show:true});
      this.setState({message:'NFT Contract not deployed on selected network. Switch to RINKEBY'});
      this.setState({dialogTitle:'Smart Contract not found'});
    }

    this.setState({ipfsGateway: `https://ipfs.infura.io`});
    this.setState({ loading: false });
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      smartPropertyMarket:{},
      contractEstate:{},
      ipfsGateway:'',
      show:false,
      message:'',
      dialogTitle:''
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <>
            <Modal
              style={{ "z-index": "1500" }}
              show={this.state.show} onHide={()=>this.setState({show:!this.state.show})}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {this.state.dialogTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {this.state.message}
              </p>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>this.setState({show:!this.state.show})}>Ok</Button>  
            </Modal.Footer>
          </Modal>
          <p id="loader" className="text-center" style={{marginTop:"300px", "fontWeight": "bold", "fontSize":"30px"}}>Setting up application. Loading...</p>
      </>
      
    } else {
      content = <Container>
      <Switch>
        <Route path="/" exact>
          <Navigation />
            <Home contract={this.state.smartPropertyMarket} propertyNft={this.state.contractEstate} ipfsGateway={this.state.ipfsGateway} />
        </Route>
        <Route path="/sell">
          <Navigation />
            <PropertySell />
        </Route>
        <Route path="/about">
          <Navigation />
            <About />
        </Route>
        <Route path="/all">
          <Navigation />
            <AllItems contract={this.state.smartPropertyMarket} propertyNft={this.state.contractEstate} ipfsGateway={this.state.ipfsGateway} />
        </Route>
      </Switch>
      <Modal
              style={{ "z-index": "1500" }}
              show={this.state.show} onHide={()=>this.setState({show:!this.state.show})}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {this.state.dialogTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {this.state.message}
              </p>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>this.setState({show:!this.state.show})}>Ok</Button>  
            </Modal.Footer>
          </Modal>
    </Container>
    }

    return (content);
  }
}

export default App;
