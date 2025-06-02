// src/pages/Main.jsx

import React from 'react';
import EmotionDiarySection from '../templates/main/EmotionDiarySection';
import RecentDiariesSection from '../templates/main/RecentDiariesSection';
import OtherDiariesSection from '../templates/main/OtherDiariesSection';
import Sidebar from '../templates/main/Sidbar';
import LayoutTwoCols from '../templates/LayoutTwoCols';
import Header from '../templates/Header';
import MainGreetingSection from '../templates/main/MainGreetingSection';
import FooterActions from '../templates/FooterActions';
import Container from '../atoms/Container';
import styled from 'styled-components';
import useUser from '../../hooks/useUser';
import { useLocation } from 'react-router-dom';

const Wrap = styled.div`
  min-height: 100vh;
  padding-bottom: 50px;
`;

const Main = () => {
  
  const { user } = useUser(); 
  const location = useLocation();
  const refetchKey = new URLSearchParams(location.search).get('refetch') || 'default';

  if (!user) return null; 

  const leftColumn = (
    <>
      <EmotionDiarySection key={refetchKey} user={user} />
      <RecentDiariesSection />
      <OtherDiariesSection />
    </>
  );

  return (
    <Wrap>
      <Container>
        <Header />
        <MainGreetingSection />
        <LayoutTwoCols
          left={leftColumn}
          right={<Sidebar uid={user.uid} />} 
        />
        <FooterActions />
      </Container>
    </Wrap>
  );
};

export default Main;
