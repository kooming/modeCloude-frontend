import React, { useState } from 'react';
import styled from 'styled-components';
import DetailBtn from '../../molecules/detail/DetailBtn';
import FeedbackModal from '../../atoms/FeedbackModal';
import { createComment } from '../../../api/diary';
import useUser from '../../../hooks/useUser';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 스타일 정의
const Section = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 25px;
  margin-top: 30px;
`;

const Header = styled.h3`
  font-size: 1.2rem;
  color: #444;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Count = styled.span`
  background: #f0f0f0;
  border-radius: 50px;
  padding: 2px 10px;
  font-size: 0.9rem;
  color: #777;
`;

const InputArea = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ddd;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border-radius: 50px;
  border: 1px solid #eee;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #b881c2;
    box-shadow: 0 0 0 3px rgba(184, 129, 194, 0.1);
  }
`;

const SubmitButton = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 15px;
`;

const Content = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Author = styled.div`
  font-weight: 600;
  color: #444;
  font-size: 0.9rem;
`;

const AvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
`;

const Time = styled.div`
  color: #999;
  font-size: 0.8rem;
`;

const Text = styled.div`
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 5px;
`;

const Action = styled.span`
  color: #999;
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #b881c2;
  }
`;

export default function CommentSection({ diaryId, comments = [] }) {
  const [localComments, setLocalComments] = useState(comments);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const user = useUser();

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const data = {
      diary_id: diaryId,
      user_id: user?.user?.uid,
      content: inputValue
    };

    try {
      const res = await createComment(data);
      if (res.success) {
        setLocalComments((prev) => [...prev, res.comment]);
        setInputValue('');
        setShowModal(true);
      }
    } catch (err) {
      console.error('댓글 등록 실패:', err);
      alert('실패');
    }
  };

  return (
    <Section>
      <Header>
        댓글 <Count>{localComments.length}</Count>
      </Header>

      <InputArea>
        {user?.user?.profile ? (
          <AvatarImg src={user.user.profile} alt="프로필 이미지" />
        ) : (
          <Avatar />
        )}
        <InputWrapper>
          <Input
            placeholder="댓글을 남겨보세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <SubmitButton>
            <DetailBtn
              icon="➤"
              bg="#b881c2"
              color="white"
              hover="#a06fb1"
              size="30px"
              onClick={handleSubmit}
            />
          </SubmitButton>
        </InputWrapper>
      </InputArea>

      <CommentList>
        {localComments.map((comment) => (
          <CommentItem key={comment.id}>
            {comment.writer?.profile_image ? (
              <AvatarImg src={comment.writer.profile_image} alt="profile" />
            ) : (
              <Avatar />
            )}
            <Content>
              <CommentHeader>
                <Author>{comment.writer?.nick_name}</Author>
                <Time>
                  {comment.createdAt
                    ? `${formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: ko
                      })}`
                    : '방금 전'}
                </Time>
              </CommentHeader>
              <Text>{comment.content}</Text>
            </Content>
          </CommentItem>
        ))}
      </CommentList>

      {showModal && (
        <FeedbackModal
          message="댓글이 작성되었습니다!"
          onClose={() => setShowModal(false)}
        />
      )}
    </Section>
  );
}
