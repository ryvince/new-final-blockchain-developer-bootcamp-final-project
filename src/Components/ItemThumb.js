import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import { Box, Image } from 'react-bulma-components';
import SmartProperty from '../abis/SmartProperty.json';
import ContractEstate from '../abis/ContractEstate.json';

import { Button,Modal} from 'react-bootstrap';


const Title = styled.h2({
  color: "#242424",
  fontWeight: "bold",
  fontSize: "1.4rem",
  marginTop: "0.3rem"
});

const Details = styled.h5({
  color: "#292A2D"
});

const ItemThumb = ({metadataUri, listingId}) => {
  const [title, setTitle] = useState(`Loading...`);
  const [location, setLocation] = useState(`Loading...`);
  const [price, setPrice] = useState(`Loading...`);
  const [description, setDescription] = useState(`Loading...`);
  const [propertySize, setPropertySize] = useState(`Loading...`);
  const [imageUrl, setImageUrl] = useState(`/`);

  const [account, setBuyerAccount] = useState('');
  const [smartPropertyMarket, setSmartPropertyMarketInstance] = useState({});

  const [nftAddress, setNftAddress] = useState('');
  const [marketAddress, setMarketAddress] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');

  const getMetadata = async () => {
    try {
      const res = await fetch(metadataUri);
      const metadata = await res.json();
      setTitle(metadata.deed);
      setLocation(metadata.location);
      setDescription(metadata.description);
      setPropertySize(metadata.propertySize);
      setPrice(window.web3.utils.fromWei(metadata.price, 'Ether'));
      setImageUrl(`${metadata.image}`);

    } catch (err) {
      // console.log(err)
    }
  }

  const loadBlockchainData = async () =>{

    const web3 = window.web3
 
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();

    const smartPropertyMarketData = SmartProperty.networks[networkId];
    const contractEstateData = ContractEstate.networks[networkId];
    const smartPropertyMarketTemp = new web3.eth.Contract(SmartProperty.abi, smartPropertyMarketData.address);

    setBuyerAccount(accounts[0]);
    setSmartPropertyMarketInstance(smartPropertyMarketTemp);
    setNftAddress(contractEstateData.address);
    setMarketAddress(smartPropertyMarketData.address);
    // console.log(marketAddress);
  }

  useEffect(() => {
    getMetadata();
    loadBlockchainData();
  }, [getMetadata, loadBlockchainData]);

  return (
    <>
      <Box>
        <Image 
          src={`${imageUrl}`}
          style={{"minWidth": "100%", }}
        />
        <Title>Deed Number: {title}</Title>
        <Details><strong>Location: </strong> {location}</Details>
        <Details><strong>Property Size: </strong> {propertySize} m<sup>2</sup></Details>
        <Details><strong>Price: </strong> {price} ETH</Details>
        <Details><strong>Description: </strong> {description}</Details>
        <br/>
        <Details><strong>Verified</strong> </Details>
        <br/>
        <button type="submit" className="btn btn-warning btn-block btn-lg" onClick={async (event)  => {
              event.preventDefault()
              console.log(marketAddress);

                try{
                const ownership = await smartPropertyMarket.methods.verifyPropertyOwnership(listingId,  account).call();
                if(ownership){
                  setShow(true);
                  setDialogTitle('Payment Stopped');
                  setMessage('You cannot buy your own property. The selected wallet was used to list the property.');
                 }else{
                  setShow(true);
                  setDialogTitle('Payment');
                  setMessage('You are about to make a purchase. You will be prompted to authorize the payment with metamask.');
    
                  await smartPropertyMarket.methods.sellPropertytoBuyer(listingId,  nftAddress).send({ from: account, value: window.web3.utils.toWei(price, 'Ether') }).on('transactionHash', async (hash) => {
                    await window.web3.eth.getTransactionReceipt(hash).then(async(result)=>{
                      if(result!=null && result.status){
                        setShow(true);
                        setDialogTitle('Payment Successful');
                        setMessage(`Transaction completed reference. : \n\n${hash}`);
                      }else{
                        setShow(true);
                        setDialogTitle('Transaction Submitted');
                        setMessage(`Transaction submitted.`);
                      }
                    })
                  })
                 }

                }catch (e) {
                  var startString = '"reason":';
                  var endString = '"},"';
    
                  var mySubString = e.message.substring(
                    e.message.indexOf(startString) + 1, 
                    e.message.lastIndexOf(endString)  ).replace('":"',': ');
    
                    if(mySubString.length<=0){
                      mySubString =e.message;
                    }
                    setShow(true);
                    setDialogTitle('Payment Failed');
                    setMessage(`${mySubString}`);
                  console.log("error making a purchase", e.message);
                } 
              
            }}>Buy Property</button>


        </Box>
              <Modal
              style={{ "z-index": "1500" }}
              show={show} onHide={()=>setShow(!show)}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {dialogTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                {message}
              </p>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>setShow(!show)}>Ok</Button>  
            </Modal.Footer>
          </Modal>
        </>
  );
};

export default ItemThumb;
