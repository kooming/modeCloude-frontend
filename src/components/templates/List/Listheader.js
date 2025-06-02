import React from 'react'
import styled from 'styled-components'
import Text from '../../atoms/Text'
import Button from '../../atoms/Button'

const ListpageHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin: 30px 0;
    justify-content: space-between;
    .list-header-text{
    padding: 10px 20px;
    }
    .list-header-btn{
    padding: 10px 20px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    border: none;

    }
`

const Listheader = ({ selectTab }) => {
  const isMyDiary = selectTab === 'mydiary';

  return (
    <ListpageHeader>
      <div className='list-header-text'>
        <Text size="1.8rem" weight="bold" color="#333">
          {isMyDiary ? '내 일기' : '모두의 일기'}
        </Text>
      </div>
      {isMyDiary && (
        <div className='list-header-btn'>
          <Button color="white" radius="50px">일기 작성하기</Button>
        </div>
      )}
    </ListpageHeader>
  );
};


export default Listheader