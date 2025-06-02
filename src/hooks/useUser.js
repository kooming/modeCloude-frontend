// hooks/useUser.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";
import { useNavigate } from "react-router-dom";
const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/login/user`, {
          withCredentials: true,
        });
        console.log(res)
        setUser(res.data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useUser;
