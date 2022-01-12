import React, { Component } from 'react';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';
import Loader from 'react-loader-spinner';

import styled from 'styled-components';
import {
  Link
} from "react-router-dom";

const StyledLink = styled(Link)`
  color: #4a4a4a;
`;

const { create } = require("ipfs-http-client");

const client = create("https://ipfs.infura.io:5001/api/v0");

  class PropertySell extends Component {
    async componentDidMount() {
      await this.loadBlockchainData()
      await this.getMyProperties()
    }

    async loadBlockchainData() {
      
      const web3 = window.web3

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const smartPropertyMarketData = SmartProperty.networks[networkId];
      const contractEstateData = ContractEstate.networks[networkId];
      const smartPropertyMarket = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);
      const contractEstate = new web3.eth.Contract(ContractEstate.abi, contractEstateData.address);

      this.setState({ account: accounts[0] });
      this.setState({marketProperties:[]});
      this.setState({ smartPropertyMarket });
      this.setState({ contractEstate });
      this.setState({ marketAddress: smartPropertyMarketData.address});
      this.setState({ contractAddress: contractEstateData.address});
      this.setState({ipfsGateway: `https://ipfs.infura.io/`});
    }

    onFileChange = event => {
      this.setState({ propertyImage: event.target.files[0] });
    };

    async getMyProperties() {
      try {
        // let allProperties = await this.state.smartPropertyMarket.methods.getAllProperties().call()
         let allProperties = await this.state.contractEstate.methods.getAllProperties().call()
        // let allProperties = await this.state.contractEstate.methods.getUserProperties().call()
        
        let newProperties = [];
          allProperties.forEach(async property => {

              const tokenId = property.deedNumber;
              const metadataUri = await this.state.contractEstate.methods.tokenURI(tokenId).call();
              const res = await fetch(metadataUri);
              const metadata = await res.json();
            let singleProperty = await this.state.smartPropertyMarket.methods.findPropertyByDeed(metadata.deed).call()
            
            if((singleProperty.sold && (singleProperty.buyer === this.state.account)) || (!singleProperty.sold && (singleProperty.seller ===this.state.account)) ){
                const  newItem = (
                  
                    <tr key={singleProperty.propertyListingId}>
                      <td >
                        <div className="td-text">
                        {singleProperty.deedNumber}
                          </div>
                      
                      </td>
                      <td>
                      <div className="td-text">
                      { window.web3.utils.fromWei(singleProperty.propertyValue, 'Ether') }
                          </div>
                      
                      </td>
                      <td>
                      <div className="td-text">
                      {metadata.propertySize} m<sup>2</sup>
                          </div>
                        
                      </td>
                      <td>
                      <div className="td-text">
                      {metadata.location}
                          </div>
                     
                      </td>
                      <td>
                        <div className="td-text">
                        {singleProperty.sold===true?"OWNER":"LISTED"}
                        </div>
                        
                      </td>
       

                      {/* <td>
                      <div className="td-text2">
                      <button type="submit" className="btn btn-warning"
                          onClick={async (event)  => {
                            this.setState({mintingStatus:0});
                            this.setState({loadingStatus:0});
                            event.preventDefault()
              
                            alert("You are about to sell your property.");

                            this.setState({txMessage:'Listing request processing. Pending authorisation'});

                            try {
                                await this.state.smartPropertyMarket.methods.relistProperty(singleProperty.propertyListingId, singleProperty.deedNumber, singleProperty.propertyValue, this.state.contractAddress ).send({from:this.state.account}).on('transactionHash', async (listingHash) => {

                                  setTimeout(() => {
                                    this.setState({loadingStatus:1});
                                    this.setState({mintingStatus:1});
                                    this.setState({finalMessage:`Request has been submitted successfully. Property will appear on the market place.\n\n`});
                                }, 1000);
                                });
                            }catch (e) {
                              
                            var startString = '"reason":';
                            var endString = '"},"';
              
                            var mySubString = e.message.substring(
                              e.message.indexOf(startString) + 1, 
                              e.message.lastIndexOf(endString)  ).replace('":"',': ');
                              this.setState({txMessage:`Selling failed. Reason: ${mySubString}`});
                            
                            alert(`Transaction failed  ${mySubString}`);
                            
                            console.log("Error making a purchase ", e.message);
                            this.setState({mintingStatus:1});
                            this.setState({loadingStatus:0});
                          } 
                        }}
                      >Sell</button>
                          </div>
                      
                      </td> */}
                    </tr>

                  );
                  newProperties.push(newItem);
            }
          });

          setTimeout(async () => {  
            await this.setState({marketProperties:newProperties});
            await this.setState({loadingProperties:false})
          },2000);
          
      } catch (err) {
        console.log(err)
      }
     
    }
  
    constructor(props) {
      super(props)
      this.state = {
        smartPropertyMarket:{},
        contractEstate:{},
        ipfsGateway:'',
        account:'',
        contractAddress:'',
        marketAddress:'',
        propertyImage: null,
        loadingStatus:0,
        mintingStatus:null,
        txError:null,
        txMessage:'Processing your transaction, please wait',
        finalMessage:'',
        loadingProperties:true
      }
    }
  

    render() {
    return (
      < div className="row">
      <div className="col-md-6">
      <h1 className="col-md-12 distance list-property"><b>List Your Property For Sale</b></h1>
      <div id="content" className="col-md-12 distance" >
        <div className="card mb-4 " >
              
          <div className="card-body">
          <div  className="distance"></div>
            <form className="mb-3" onSubmit={async (event) => {
                event.preventDefault()

                const imageLocation = this.state.propertyImage;
                const deed = this.deed.value;
                const location = this.location.value.toString();
                const propertySize = this.propertySize.value.toString();
                const description = this.description.value.toString();

                let price = this.price.value.toString();
                price = window.web3.utils.toWei(price, 'Ether');

                this.setState({mintingStatus:0});

                Array.from(event.target).forEach((e) => (e.value = ""));

                this.setState({txMessage:'Uploading files to IPFS'});

                try {
                  const propertyExists = await this.state.contractEstate.methods.checkIfPropertyExists(deed).call()
                  if(propertyExists){
                    this.setState({txMessage:'Property with title deed number is already minted'});
                    this.setState({finalMessage:'Property with title deed number is already minted'})
                  }else{
                                  try {
                                    
                                    const url = await client.add(imageLocation);
                                    const uploadedImageUrl = `https://ipfs.infura.io/ipfs/${url.path}`;

                                    const metadata = {
                                      deed:deed,
                                      location: location,
                                      description:description,
                                      image: uploadedImageUrl,
                                      propertySize:propertySize,
                                      price:price
                                    };

                                    const metadataRes = await client.add(JSON.stringify(metadata));
                                    const tokenURI = `https://ipfs.infura.io/ipfs/${metadataRes.path}`;
                                    this.setState({txMessage:`Minting token ${tokenURI}\n\n ...`});

                                    try {
                                      await this.state.contractEstate.methods.createPropertyNft(tokenURI, price, deed).send({from:this.state.account}).on('transactionHash', async (hash) => {
                                        console.log('Minting :', hash);

                                      setTimeout(async () => {  
                                        this.setState({txMessage:'Processing please wait...'});

                                          setTimeout(async () => {
                                            this.setState({txMessage:'Listing. Pending Second Authorization...'});
                                            await this.state.smartPropertyMarket.methods.listPropertyOnEstateMarket(deed, price, this.state.contractAddress ).send({from:this.state.account}).on('transactionHash', async (listingHash) => {
                                              console.log('Listing :', listingHash);
                      
                                              setTimeout(() => {
                                                this.setState({loadingStatus:1})
                                                this.setState({mintingStatus:1})
                                                this.setState({finalMessage:`Property has been uploaded and listed. ${listingHash}`})
                                            }, 1000);
                                          },30000);
                                          });
                                        }, 5000);
                                      });
                                    }catch (e) {
                                      this.setState({txMessage:`An error occured while minting: ${e.message}`});
                                      this.setState({finalMessage:`An error occured while minting ${e.message}`})
                                      console.log("error uploading to minting NFT ", e);
                                    }
                                  } catch (e) {
                                    this.setState({txMessage:'An error occured while uploading files to IPFS'});
                                      this.setState({finalMessage:'An error occured while uploading files to IPFS'})
                                      console.log("error uploading to IPFS ", e);
                                    }
                  }

                }catch (e) {
                  this.setState({txMessage:'An error occured while minting'});
                  this.setState({finalMessage:'An error occured while minting'})
                  console.log("error uploading to minting NFT ", e);
                }
              
              }}>

          <div className="row mb-4">  
              <div className="input-group col-md-7">
                <input
                  type="file"
                  onChange={this.onFileChange}
                  ref={(imageLocation) => { this.imageLocation = imageLocation }}
                  className="form-control form-control-lg"
                  placeholder="Upload Image"
                  required />
              </div>

              <div className="input-group col-md-5">
                <input
                  type="number"
                  ref={(deed) => { this.deed = deed }}
                  className="form-control form-control-lg"
                  placeholder="Title Deed Number"
                  required />
              </div>
        </div>
              <div className="row mb-4">
                <div className="input-group  col-md-6">
                  <input
                    type="text"
                    ref={(location) => { this.location = location }}
                    className="form-control form-control-lg"
                    placeholder="Location"
                    required />
                </div>
                <div className="input-group col-md-6">
                  <input
                    type="text"
                    ref={(propertySize) => { this.propertySize = propertySize }}
                    className="form-control form-control-lg"
                    placeholder="Property Area Size (Acres)"
                    required />
                </div>
              </div>

              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(price) => { this.price = price }}
                  className="form-control form-control-lg"
                  placeholder="Price in ETH"
                  required />
              </div>

              <div className="input-group mb-4">
                <textarea
                  type="text"
                  ref={(description) => { this.description = description }}
                  className="form-control form-control-lg"
                  placeholder="Property Description"
                  required />
              </div>
              <button type="submit" className="btn btn-warning btn-block btn-lg">Submit</button>
            </form>
          </div>
        </div>

      </div>
      </div>

      <div className="col-md-6">

{this.state.loadingStatus === 0 ? (
					this.state.mintingStatus === 0 ? (
						this.state.txError === null ? (
							<div className='flex flex-col justify-center items-center'>
								<div className='text-lg font-bold mt-16 justify-center center-class'>
									{this.state.txMessage}
								</div>
                <Loader
                    className='flex justify-center items-center pt-12 center-class2'
                    type='TailSpin'
                    color='#6B7280'
                    height={40}
                    width={40}
                  />
							</div>
						) : (
							<div className='justify-center items-center text-lg text-red-600 font-semibold'>
								{this.state.txError}
							</div>
						)
					) : (
            
						<div>
                      <h1 className="col-md-12 distance list-property"><b>My Properties</b></h1>
                      <div id="content" className="col-md-12 distance" >
                          <div className="card mb-4" >
                            <div className="card-body">
                              <div className="distance">
                                
                              {this.state.loadingProperties ?

                                <Loader
                                className='flex justify-center items-center pt-12 center-class2'
                                type='TailSpin'
                                color='#6B7280'
                                height={40}
                                width={40}
                                />:
                              <table>
                              <tr className="tableHearder">
                                  <td>
                                    Deed
                                  </td>
                                  <td>
                                    Price
                                  </td>
                                  <td>
                                    Size
                                  </td>
                                  <td>
                                    Location
                                  </td>
                                  <td>
                                    Status
                                  </td>
                                  {/* <td>
                                    Actions
                                  </td> */}
                                </tr>

                                {this.state.marketProperties}
                                
                              </table>}
                              </div>
                            </div>
                          </div>
        </div>
            </div>
					)
				) : (
					<div className='justify-center items-center center-class '>
						{this.state.finalMessage}
            <StyledLink to="/" className="btn btn-warning btn-block btn-lg">
              View Property in Market Place
            </StyledLink>
					</div>
				)}



      </div>

      </div>
    );
            }
};

export default PropertySell;