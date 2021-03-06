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
            Welcome to Title Transfer
          </Heading>
          <Heading subtitle size={4}>
            Your smart contract-enabled marketplace for real estate and personal property
          </Heading>
        </Container>
      </Hero.Body>
    </StyledHero>
    
  );}
};

export default Welcome;