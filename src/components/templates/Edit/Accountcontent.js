import React, { useState } from 'react'
import Profilesetup from '../../atoms/Edit/Profilesetup'
import styled from 'styled-components'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'

const Accountcontentheader = styled.div`
  width: 100%;
  .account-header{
    width: 100%;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
`
const ContentStyle = styled.div`
  width: 100%;
  padding: 0 20px;
  margin-top: 30px;
  .delete-popup{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.5);
  }
  .delete-popup-warp {
    width: 500px;
    height: 500px;
    background-color: white;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    .delete-popup-warp-header{
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .delete-popup-warp-btns{
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 150px;
    
  }
`

const AccoutcontentwWrap = styled.div`
  .delete-warp{
    margin-top: 144px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .delete-btn{
    margin-bottom: 4px;
  }
`

const Accountcontent = () => {
  const [active, setActive] = useState(false);
  return (
    <Profilesetup>
      <ContentStyle>
        <Accountcontentheader>
          <div className='account-header'>
            <Text color={"#444"} weight={"bold"} size={"1.3rem"}>계정관리</Text>
          </div>
        </Accountcontentheader>
        <AccoutcontentwWrap>
          <div className='delete-warp'>
            <div className='delete-btn'>
              <Button onClick={() => setActive(true)} background={"white"}>🗑️ 계정 삭제</Button>
            </div>
            <div>
              <Text weight={"bold"} size={"0.9rem"} color={"red"}>계정을 삭제할시 모든 데이터가 삭제됩니다.</Text>
            </div>
          </div>
        </AccoutcontentwWrap>
        {active ? <div className='delete-popup'>
          <div className='delete-popup-warp'>
            <div className='delete-popup-warp-header'>
              <Text color={"red"} size={"1.1rem"} weight={"bold"}>정말 삭제 하시겠습니까?</Text>
            </div>
            <div className='delete-popup-warp-btns'>
              <Button onClick={()=> setActive(false)} background={"white"}>취소</Button>
              <Button background={"#f44336"} color={""}>삭제</Button>
            </div>
          </div>
        </div> : null}

      </ContentStyle>
    </Profilesetup>

  )
}

export default Accountcontent