import React from 'react'
import styled from 'styled-components';
const ProfieWrap = styled.div`
    width: ${({ width }) => width || "100px"};
    height: ${({ height }) => height || "100px"};
    border-radius: 50%;
    border: ${({ border }) => border || "none"};
    background-color: ${({ color }) => color || "#ddd"};
    position : relative;
    span {
      width :30px;
      height :30px;
      display : flex; 
      justify-content : center;
      align-items : center;
      border-radius : 50%;
      border : 2px solid #fff;
      background-color : #b881c2;
      position : absolute;
      right : 0;
      bottom : 0;
    }
`
const ImgWarp = styled.div`
  position: relative;
  img{
    width: 100px;
    height: 100px;
     border-radius: 50%;
  }span{
      width :30px;
      height :30px;
      display : flex; 
      justify-content : center;
      align-items : center;
      border-radius : 50%;
      border : 2px solid #fff;
      background-color : #b881c2;
      position : absolute;
      right : 0;
      bottom : 0;
    }
`

const Profile = ({ children, width, height, border, color, isTag = false , imageUrl }) => {
  if(imageUrl==="")
  return (
    <ProfieWrap width={width} height={height} border={border} color={color}>
      {children}
      {isTag ? <span>✏️</span> : null} 
    </ProfieWrap>
  )
  return (<ImgWarp>
  <img src={imageUrl}/>
  {isTag ? <span>✏️</span> : null} 
  </ImgWarp>)
}

export default Profile