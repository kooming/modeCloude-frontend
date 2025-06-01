import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../templates/Header';
import ListItem from '../molecules/List/Listitem'; 
import Listheader from '../templates/List/Listheader';
import Listselectwarp from '../templates/List/Listselectwarp';
import useInput from '../../hooks/useInput';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import Text from '../atoms/Text';
import { Link } from 'react-router-dom';

const ListPageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`;

const DiaryContentWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-top: 10px;
  .empty-message {
    text-align: center;
    padding: 40px 20px;
    color: #777;
    font-size: 1rem;
  }
  a { 
    text-decoration: none;
    color: inherit;
  }
`;

const PaginationWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 6px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  background: ${({ active }) => (active ? '#b881c2' : '#eee')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const RecordListPage = () => {
  const [selectTab, setSelectTab] = useState('mydiary');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [emotion, setEmotion] = useState('전체');
  
  const [order, setorderState] = useState('desc'); 
  const [ispublic, setispublicState] = useState('전체'); 
  const [value, setvaluehandler, setvalueState] = useInput(''); 

  const [myDiaryDatarel, setmyDiaryDatarel] = useState([]); 

  const totalItems = myDiaryDatarel.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisplayItems = myDiaryDatarel.slice(indexOfFirstItem, indexOfLastItem);

  const visiblePageCount = 5;
  const currentGroup = Math.floor((currentPage - 1) / visiblePageCount);
  const startPage = currentGroup * visiblePageCount + 1;
  const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

  const isPrevGroupAvailable = startPage > 1;
  const isNextGroupAvailable = endPage < totalPages;

  const goToPrevGroup = () => {
    if (isPrevGroupAvailable) {
      setCurrentPage(startPage - 1);
    }
  };

  const goToNextGroup = () => {
    if (isNextGroupAvailable) {
      setCurrentPage(endPage + 1);
    }
  };

  const dataQuery = (paramName, initValue, currentValue) => {
    if (currentValue && currentValue !== initValue && currentValue !== "전체") {
      return `${paramName}=${encodeURIComponent(currentValue)}`;
    }
    return "";
  };

  const getListData = async () => {
    const commonQueries = [
      dataQuery("emotion", "전체", emotion),
      dataQuery("order", "desc", order), 
      dataQuery("title", "", value)      
    ].filter(q => q).join("&");

    let apiUrlSegment = "/list";
    let specificQueries = "";

    if (selectTab === 'publicdiary') {
      apiUrlSegment = "/list/followed"; 
    } else { 
      apiUrlSegment = "/list";
      specificQueries = dataQuery("public", "전체", ispublic);
    }
    
    const allQueries = [commonQueries, specificQueries].filter(q => q).join("&");
    const queryString = allQueries ? `?${allQueries}` : '';
    const fullApiUrl = `${API_URL}${apiUrlSegment}${queryString}`;

    try {
      console.log(`Fetching from: ${fullApiUrl} for tab: ${selectTab}`);
      const { data } = await axios.get(fullApiUrl, { withCredentials: true });
      setmyDiaryDatarel(data || []); 
      setCurrentPage(1);
    } catch (error) {
      console.error(`Error fetching list data for tab ${selectTab}:`, error);
      setmyDiaryDatarel([]); 
    }
  };

  useEffect(() => {
    getListData();
  }, [emotion, order, ispublic, value, selectTab]); 

  const getEmptyMessage = () => {
    if (selectTab === 'mydiary') {
      return '작성된 일기가 없습니다. 첫 일기를 작성해보세요!';
    }
    if (selectTab === 'publicdiary') {
      return '팔로우한 사용자의 공개된 일기가 없거나, 아직 팔로우한 사용자가 없습니다.';
    }
    return '표시할 일기가 없습니다.';
  };

  return (
    <ListPageWrap>
      <Header />
      <Listheader selectTab={selectTab} />
      <Listselectwarp
        setEmotion={setEmotion}
        setorder={setorderState} 
        setispublic={setispublicState} 
        setvaluehandler={setvaluehandler} 
        onClick={(tab) => {
          setSelectTab(tab);
        }}
        selectTab={selectTab}
      />
      <DiaryContentWrap>
        {currentDisplayItems.length > 0 ? (
          currentDisplayItems.map(diary => (
            <Link key={diary.id} to={`/detail/${diary.id}`}>
              <ListItem
                title={diary.title}
                description={diary.content} 
                date={new Date(diary.createdAt).toLocaleDateString()} 
                isPublic={diary.isPublic} 
                author={(selectTab === 'publicdiary' && diary.writer && diary.writer.nick_name) ? diary.writer.nick_name : null}
                authorProfileImage={(selectTab === 'publicdiary' && diary.writer && diary.writer.profile_image) ? diary.writer.profile_image : null}
                userEmotion={diary.emotion} 
                aiEmotion={diary.selectEmotion} 
              />
            </Link>
          ))
        ) : (
          <div className="empty-message">
            <Text>{getEmptyMessage()}</Text>
          </div>
        )}
      </DiaryContentWrap>

      {totalItems > 0 && (
        <PaginationWrap>
          <PageButton onClick={goToPrevGroup} disabled={!isPrevGroupAvailable}>
            ◀
          </PageButton>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <PageButton
              key={startPage + i}
              active={currentPage === startPage + i}
              onClick={() => setCurrentPage(startPage + i)}
            >
              {startPage + i}
            </PageButton>
          ))}
          <PageButton onClick={goToNextGroup} disabled={!isNextGroupAvailable}>
            ▶
          </PageButton>
        </PaginationWrap>
      )}
    </ListPageWrap>
  );
};

export default RecordListPage;