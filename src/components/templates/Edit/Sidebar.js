import React from 'react'
import styled from 'styled-components'
import Profiles from '../../molecules/Edit/Profiles'
import Tab from '../../atoms/Edit/Tab'


const SidebarWrap = styled.div`
    width: 250px;
    background-color: #f9f9f9;
    padding: 25px 0;
    border-radius: 15px 0 0 15px;
    .sidebar-icon{
        width: 20px;
        text-align: center;
    }
    & .tab-wrap.profile > div:nth-child(1){
        background-color : #f0f0f0;
        color: #b881c2;
        border-left: 3px solid #b881c2;
    }
    & .tab-wrap.friend > div:nth-child(2){
        background-color : #f0f0f0;
        color: #b881c2;
        border-left: 3px solid #b881c2;
    }
    & .tab-wrap.account > div:nth-child(3){
        background-color : #f0f0f0;
        color: #b881c2;
        border-left: 3px solid #b881c2;
    }
`

const Sidebar = ({onClick, selectTab}) => {

    return (
        <SidebarWrap>
            <Profiles />
            <div className={`tab-wrap ${selectTab}`}>
                <Tab onClick={() =>  onClick("profile")}>
                    <span className='sidebar-icon'>👤</span>
                    프로필 정보
                </Tab>
                <Tab  onClick={() => {onClick("friend")}}>
                    <span className='sidebar-icon'>👥</span>
                    팔로워/팔로잉
                </Tab>
                <Tab  onClick={() => {onClick("account")}}>
                    <span className='sidebar-icon'>⚙️</span>
                    계정 관리
                </Tab>
            </div>
        </SidebarWrap>
    )
}


export default Sidebar