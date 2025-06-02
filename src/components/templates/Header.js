// 📁 src/templates/Header.jsx
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import logo from '../../images/logo2.png';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import { AiOutlineSearch } from 'react-icons/ai';
import { getSearchUsers } from '../../api/user';
import { encodeUidToHash } from '../../utills/useUtills'; 
import { API_URL } from '../../constants/api';

const Nav = styled.nav`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  padding: 20px 0;
`;

const LayoutWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 50px;
    height: 50px;
  }

  h1 {
    font-size: 1.2rem;
    color: #a472c3;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const NavLinks = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  a {
    text-decoration: none;
    color: #666;
    font-weight: 500;

    &.active {
      color: #c271d2;
      font-weight: 600;
    }

    &:hover {
      color: #a472c3;
    }
  }

  @media (max-width: 768px) {
    flex: none;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 10px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 15px;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 280px;

  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 6px;
    font-size: 1rem;
    width: 100%;
  }

  svg {
    color: #aaa;
    font-size: 1.2rem;
    margin-right: 8px;
  }
`;

const SearchResults = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 280px;
  z-index: 999;
  list-style: none;
  padding: 0;
  margin: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  max-height: 240px;
`;

const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #f3e9f8;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const ResultImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const ResultName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #444;
`;

const ProfileSection = styled.div`
  position: relative;
`;

const ProfileCircle = styled.div`
  width: 50px;
  height: 50px;
  background-color: #ddd;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 42px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: ${({ open }) => (open ? 'block' : 'none')};
  min-width: 120px;

  a {
    display: block;
    padding: 0.6rem 1rem;
    text-decoration: none;
    color: #444;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background-color: #f6effb;
      color: #a472c3;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
`;

const Header = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useUser();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === '') return setResults([]);

    try {
      const res = await getSearchUsers(value);
      setResults(res.users);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  const handleSelect = (user) => {
    const hash = encodeUidToHash(user.uid); 
    navigate(`/mypage/${hash}`);
    setKeyword('');
    setResults([]);
  };

  return (
    <Nav>
      <LayoutWrapper>
        <LogoSection>
          <img src={logo} alt="Mood Cloud 로고" />
          <h1>
            <Link to="/main">Mood Cloud</Link>
          </h1>
        </LogoSection>

        <NavLinks>
          <Link to="/main" className="active">홈</Link>
          <Link to="/list">내 일기</Link>
          <Link to="/statistics">통계</Link>
        </NavLinks>

        <RightSection>
          <SearchBox>
            <SearchInputWrapper>
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="닉네임 검색"
                value={keyword}
                onChange={handleSearch}
              />
            </SearchInputWrapper>
            {results.length > 0 && (
              <SearchResults>
                {results.map((user) => (
                  <ResultItem key={user.uid} onClick={() => handleSelect(user)}>
                    <ResultImage
                      src={user.profile_image || '/default-profile.png'}
                      alt="프로필"
                    />
                    <ResultName>{user.nick_name}</ResultName>
                  </ResultItem>
                ))}
              </SearchResults>
            )}
          </SearchBox>

          <ProfileSection ref={dropdownRef}>
            <ProfileCircle onClick={() => setOpen(!open)}>
              {user && user.profile && (
                <img
                  src={user.profile}
                  alt="프로필"
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              )}
            </ProfileCircle>
            <Dropdown open={open}>
              {user && (
                <Link to="/mypage">내정보</Link>
              )}
              <a href={`${API_URL}/login/logout`}>로그아웃</a>
            </Dropdown>
          </ProfileSection>
        </RightSection>
      </LayoutWrapper>
    </Nav>
  );
};

export default Header;
