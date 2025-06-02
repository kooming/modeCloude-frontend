import React from 'react'
import Profilesetup from '../../atoms/Edit/Profilesetup'
import styled from 'styled-components'
import Text from '../../atoms/Text'
const Followwarp = styled.div`
  width: 50%;
  height: 100%;
  border-right: 3px solid #eee;
  box-sizing: border-box;
  float: left;
`
const Followingwarp = styled.div`
  width: 50%;
  height: 100%;
  box-sizing: border-box;
`
const FriendHead = styled.div`
  text-align: center;
  padding-bottom: 7px;
  border-bottom: 1px solid #eee;
`
const Friendsdata = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
`

const Friendcontent = () => {
  return (
    <Profilesetup>
      <Followwarp>
        <FriendHead>
          <Text weight={"bold"} size={"1.2rem"}>팔로워</Text>
        </FriendHead>
        <Friendsdata>
          <div>더미데이터</div>
          <div>더미데이터</div>
          <div>더미데이터</div>
        </Friendsdata>
      </Followwarp>
      <Followingwarp>
        <FriendHead>
          <Text weight={"bold"} size={"1.2rem"}>팔로잉</Text>
        </FriendHead>
        <Friendsdata>
          <>더미데이터</>
          <>더미데이터</>
          <>더미데이터</>
        </Friendsdata>
      </Followingwarp>
    </Profilesetup>
  )
}

export default Friendcontent