import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Text from '../../atoms/Text';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import { getUserById, getUserStatsById } from '../../../api/user';
import FollowButton from '../detail/FollowButton';

const Wrapper = styled.div` margin-top: 30px; `;
const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #ddd;
  background-size: cover;
  background-position: center;
`;
const Flex = styled.div` display: flex; align-items: center; gap: 30px; `;
const TextWrap = styled.div` display: flex; flex-direction: column; gap: 10px; `;
const StatWrap = styled.div` display: flex; align-items: center; gap: 30px; `;
const StatItem = styled.div` display: flex; flex-direction: column; align-items: center; `;
const ButtonWrap = styled.div` display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; `;

const UserProfileLeft = ({ uid, isMyPage, onFollowChange }) => {
  const { user } = useUser();
  const [profileUser, setProfileUser] = useState(null);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    diaryCount: 0,
    followerCount: 0,
    followingCount: 0,
    bio: ''
  });

  const loadStats = async () => {
    try {
      const statRes = await getUserStatsById(uid);
      setStats(statRes);
    } catch (err) {
      console.error('통계 정보 로딩 실패:', err);
    }
  };

  const handlEdit = () => {
    navigate('/edit'); 
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserById(uid);
        setProfileUser(res);
      } catch (err) {
        console.error('프로필 로딩 실패:', err);
      }
    };

    if (uid) {
      fetchProfile();
      loadStats();
    }
  }, [uid]);

  if (!profileUser) return null;

  const isMe = user?.uid === Number(uid);

  const handleFollowChange = async (newState) => {
    await loadStats();
    if (onFollowChange) onFollowChange(newState);
  };

  return (
    <Wrapper>
      <Card>
        <Flex>
          <Avatar style={{ backgroundImage: `url(${profileUser.profile_image})` }} />
          <TextWrap>
            <Text size="1.8rem" weight="bold">{profileUser.nick_name}</Text>
            <Text color="#777">{profileUser.bio || '자기소개가 없습니다.'}</Text>
            <StatWrap>
              <StatItem>
                <Text color="#b881c2" weight="bold" size="1.2rem">{stats.diaryCount}</Text>
                <Text color="#777">일기</Text>
              </StatItem>
              <StatItem>
                <Text color="#b881c2" weight="bold" size="1.2rem">{stats.followerCount}</Text>
                <Text color="#777">팔로워</Text>
              </StatItem>
              <StatItem>
                <Text color="#b881c2" weight="bold" size="1.2rem">{stats.followingCount}</Text>
                <Text color="#777">팔로잉</Text>
              </StatItem>
            </StatWrap>
          </TextWrap>
        </Flex>

        <ButtonWrap>
          {isMe ? (
            <Link to="/setting">
              <Button weight="100px" color="#b881c2" radius="30px" background="white" onClick={handlEdit}>
                프로필 편집
              </Button>
            </Link>
          ) : (
            user && (
              <FollowButton
                myId={user.uid}
                targetId={uid}
                onFollowChange={handleFollowChange}
              />
            )
          )}
        </ButtonWrap>
      </Card>
    </Wrapper>
  );
};

export default UserProfileLeft;
