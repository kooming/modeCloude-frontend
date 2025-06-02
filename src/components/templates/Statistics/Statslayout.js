import React from 'react';
import EmotionChart from '../../molecules/Statistics/EmotionChart'; // Statscard를 EmotionChart로 사용
import EmotionRankCard from '../../molecules/Statistics/EmotionRankCard';
import styled from 'styled-components';

const EmotionTopBodyWarp = styled.div`
  display: flex;
  gap: 20px; /* 카드 간 간격 */
  flex-wrap: wrap; /* 화면이 작아지면 줄바꿈 */
  justify-content: center; /* 중앙 정렬 (선택 사항) */
  margin-bottom: 30px;
`;

const Statslayout = ({ filteredEmotionData }) => {
  return (
    <EmotionTopBodyWarp >
      {/* 각 카드에 필터링된 데이터 전달 */}
      <EmotionChart dataForChart={filteredEmotionData} />
      <EmotionRankCard dataForRank={filteredEmotionData} />
    </EmotionTopBodyWarp>
  );
};

export default Statslayout;