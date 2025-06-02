import axios from "axios";
import { API_URL } from '../constants/api';

// 로그인 정보 
  export const userLogin = async () => {
    const {data} = await axios.get(`${API_URL}/login/kakao`, {
      withCredentials : true
    })
    return data;
  }

// 로그인 정보 통계 
  export const getUserStats = async () => {
    const res = await axios.get(`${API_URL}/detail/stats`, {
        withCredentials: true
    });
    return res.data.data;
  };

  // 특정 유저 프로필 가져오기 
  export const getUserById = async (uid) => {
    const res = await axios.get(`${API_URL}/login/${uid}`);
    return res.data;
  };
  
  // 남정보 통계 가져오기
  export const getUserStatsById = async (uid) => {
    const res = await axios.get(`${API_URL}/detail/stats/${uid}`); 
    return res.data.data;
  };

  // 닉네임 검사 
  export const getSearchUsers = async (query) => {
    const res = await axios.get(`${API_URL}/login/search/users?q=${query}`)
    return res.data;
  }
