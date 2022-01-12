import React, { Component } from 'react';
import { Container, Heading, Hero } from 'react-bulma-components';
import styled from 'styled-components';

const StyledHero = styled(Hero)`
  margin-bottom: 3rem
`;

// const Welcome = () => {
  class Welcome extends Component {

    render() {
  return (
    <StyledHero color="primary" gradient>

      <Hero.Body>
        <Container>
          <Heading>
            Welcome to Title Tansfer - Smart Contracts
          </Heading>
          <Heading subtitle size={4}>
            Buy and Sell Real Estate using NFT Deeds
          </Heading>
        </Container>
      </Hero.Body>
    </StyledHero>
    
  );}
};

export default Welcome;