import React, { Component } from 'react';
import { Columns, Heading, Section,  } from 'react-bulma-components';

import Hero from '../Components/Hero';
import Market from '../Components/Market';

// const Home = ({contract, propertyNft, ipfsGateway}) => {
  class Home extends Component {

    render() {
  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">See properties for sale</Heading>(Newly listed properties may take a moment to display, as the blocks chain together)
      <Columns>
        <Market contract={this.props.contract} propertyNft={this.props.propertyNft} ipfsGateway={this.props.ipfsGateway} limit={3} />
      </Columns>
    </Section>
  )}
};

export default Home;