import React, { Component } from 'react';
import { Heading, Section,  } from 'react-bulma-components';

import Hero from '../Components/Hero';

// const About = () => {
  class About extends Component {

    render() {
  

  return (
    <Section>
      <Hero />
      <Heading size={5} renderAs="h1">About</Heading>
      <p>Decentralized transfer of property will change the world.</p>
    </Section>
  )}
};

export default About;