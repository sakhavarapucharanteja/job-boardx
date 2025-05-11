import React from 'react';
import Header from './Header';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container>
    <Header />
    <Content>{children}</Content>
  </Container>
);

export default Layout;