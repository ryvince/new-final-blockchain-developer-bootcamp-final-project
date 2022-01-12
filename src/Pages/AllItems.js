import React, { Component } from 'react';
import { Columns, Heading, Section,  } from 'react-bulma-components';
import Hero from '../Components/Hero';
import Market from '../Components/Market';

import { Link } from "react-router-dom";

// const AllItems = ({contract, propertyNft, ipfsGateway}) => {
  class AllItems extends Component {

    render() {
  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">All Items</Heading>
      <Columns>
        <Market contract={this.props.contract} propertyNft={this.props.propertyNft} ipfsGateway={this.props.ipfsGateway} />
      </Columns>
      <p>Want to get your property listed? <Link to="/contact">Get in touch</Link>.</p>
    </Section>
  );}
};

export default AllItems;