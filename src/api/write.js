import axios from 'axios';
import { API_URL } from '../constants/api';

// ${API_URL} 이거 그거임 localhost:4000번 뺴놓은거 나중에 배포할때 저기서 값만 바꾸면되서 이렇게 함. 

// 업로드 
export const uploadImage = async (blob) => {
  const formData = new FormData();
  formData.append('image', blob);

  const res = await axios.post(`${API_URL}/write/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
  });
  console.log('서버에서 받은 이미지 URL:', res.data.url);
  return res.data.url;
};

// 다이어리 저장 
export const saveDiary = async (data) => {
  const res = await axios.post(`${API_URL}/write`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, 
  });
  return res.data;
};

  export const analyzeEmotion = async (content) => {
    try {
      const response = await axios.post(
        `${API_URL}/write/analyze`,
        { content },
        {
          withCredentials: true,
        }
      );
      const result = response.data.emotion?.trim();
      console.log('[디버깅] AI 감정 분석 결과:', result);
  
      if (!result) {
        console.warn('감정 분석 결과가 비어 있습니다.');
        return null;
      }
      return result;
    } catch (error) {
      console.error('감정 분석 실패:', error);
      return null;
    }
  };
