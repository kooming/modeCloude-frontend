import React from 'react';
import styled from 'styled-components';
import Card from '../../atoms/Card';
import Text from '../../atoms/Text';
import Icon from '../../atoms/List/Icon';
import Emotion /*, { getEmotionLabel } */ from '../../atoms/Emotion'; // getEmotionLabel 사용하지 않으면 제거 가능

const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  .diary-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .diary-right {
    display: flex;
    gap: 5px;
    align-items: center;
  }
  .diary-left {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;
const EmotionsWrap = styled.div`
  display: flex; 
  align-items: flex-start; /* 아이콘과 텍스트 정렬을 위해 변경 */
  gap: 15px; /* 감정 사이 간격 조정 */
  text-align: center;
  
  .emotion-item { /* 각 감정 요소를 위한 클래스 */
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px; /* 아이콘과 텍스트 사이 간격 */
  }
`;

// ListItem props 수정: emotion 대신 userEmotion, aiEmotion 받도록
const ListItem = ({ title, description, date, type, author, userEmotion, aiEmotion }) => {
  return (
    <Card>
      <ItemWrap>
        <TopRow>
          <div className='diary-left'>
            <Text size="1.1rem" weight="bold" color="#333">{title}</Text>
            {author && <Text size="0.8rem">{author}</Text>} {/* author가 있을 경우에만 표시 */}
          </div>
          <div className='diary-right'>
            {type && <Icon type={type} />} {/* type이 있을 경우에만 Icon 표시 */}
            <Text size="0.85rem" color="#999">{date}</Text>
          </div>
        </TopRow>
        <div className='diary-bottom'>
          <Text size="0.95rem" color="#666" display={"block"} width={"calc(100% - 150px)"}>{description}</Text> {/* 감정 표시 공간 확보 위해 너비 조정 */}
          <EmotionsWrap>
            {userEmotion && ( // userEmotion 객체가 있을 경우 "나의 감정" 표시
              <div className='emotion-item'>
                <Emotion type={userEmotion.id} /> 
                <Text size="0.75rem" color="#888">{userEmotion.name}</Text> 
              </div>
            )}
            {aiEmotion && ( // aiEmotion 객체가 있을 경우 "AI 추천 감정" 표시
              <div className='emotion-item'>
                <Emotion type={aiEmotion.id} />
                <Text size="0.75rem" color="#888">{aiEmotion.name}</Text>
              </div>
            )}
          </EmotionsWrap>
        </div>
      </ItemWrap>
    </Card>
  );
};

export default ListItem;