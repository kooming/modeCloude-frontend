import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Profile from '../../atoms/Profile'
import Text from '../../atoms/Text'
import { API_URL } from '../../../constants/api'

const ProfliesWrap = styled.div`
    padding: 0 20px 20px;
    text-align: center;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    .edit-img-wrap{
        display: flex;
        justify-content: center;
        margin: 0 auto 15px;
    }
    .proflie-name{
        margin-bottom: 5px;
    }
`


const Profiles = () => {
    const [originalName, setOriginalName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    async function fetchUserProfile() {
        const API_BASE_URL = API_URL || '';
        try {
            const response = await fetch(`${API_BASE_URL}/api/setting/me/profile`, { // 백엔드에 만든 프로필 조회 API 경로
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '프로필 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.' }));
                throw new Error(errorData.message || '프로필 정보를 불러오는데 실패했습니다.');
            }
            const result = await response.json();
            if (result.success && result.user) {
                setOriginalName(result.user.nickname)
                setProfileImage(result.user.profile)
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [])
    return (
        <ProfliesWrap>
            <div className='edit-img-wrap'>
                <Profile isTag={true} imageUrl={profileImage} />
            </div>
            <div className='proflie-name'>
                <Text size={"1.1rem"} weight={"600"} color={"#444"}>{originalName}</Text>
            </div>
        </ProfliesWrap>
    )
}

export default Profiles