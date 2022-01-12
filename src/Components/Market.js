import React, { Component } from 'react';
import ItemThumb from './ItemThumb';

  class Market extends Component {
    

    async componentDidMount() {

      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
      await this.getSupply();
    }

    constructor(props) {
      super(props)
      this.state = {
        account:'',
        marketProperties:[]
      }
    }

  async getSupply() {
    try {
      const smartPropertyMarketContract = this.props.contract;
      const estateContractNft = this.props.propertyNft;
      let allProperties = await smartPropertyMarketContract.methods.getAvailableProperties().call()
      let newProperties = [];
        allProperties.forEach(async property => {
          const tokenId = property.deedNumber;

          const metadataUri = await estateContractNft.methods.tokenURI(tokenId).call();

          
          if(metadataUri!=='http://localhost:3000/logo-sample.png'){
            const newItem = (
              <div className="col-md-4 mb-4" key={property.propertyListingId}>
                <ItemThumb metadataUri={metadataUri} listingId={property.propertyListingId} />
              </div>
            );
  
             newProperties.push(newItem);
            this.setState({marketProperties:newProperties})
          }

        });
    } catch (err) {
      console.log(err)
    }
  }

  render() {
  return (
    <div className="row distance">
      {this.state.marketProperties}
    </div>
  );}
};

export default Market;
