import React from 'react'
import Card from '../../atoms/Card'
import Listselect from '../../molecules/List/Listselect'
import styled from 'styled-components'
import Listtap from '../../molecules/List/Listtab'
const Listselects = styled.div`
  display: flex;
  gap: 15px;
`
const Listselectheaderleft = styled.div`
  display: flex;
  gap: 15px;
`
const Searchbar = styled.div`
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: 1px solid #eee;
    padding: 8px 12px;
    background: #f9f9f9;
    span{
    color: #999;
    font-size: 0.9rem;
    margin-right: 8px;
    }
    input{
    border: none;
    background: transparent;
    font-size: 0.9rem;
    color: #555;
    width: 150px;
    }
`
const Listselectwarp = ({ onClick, selectTab, setEmotion,setorder,setispublic,setvaluehandler }) => {
  return (
    <Card>
      <Listselectheaderleft>
        <Listselects>
          <Listselect onEvent={setEmotion} values={['전체','happy','sad','angry','calm','anxious','tired','excited','confused']} selects={["전체", "행복", "슬픔", "분노", "평온", "불안", "피곤", "신남", "혼란"] }>감정</Listselect>
          <Listselect onEvent={setorder} values={["desc", "asc", "전체"]} selects={["최신순", "오래된순", "제목순"]}>정렬</Listselect>
          <Listselect onEvent={setispublic} values={["전체","true",'false']} selects={["전체", "공개", "비공개"]} >공개</Listselect>
        </Listselects>
        <Searchbar>
          <span>🔍</span>
          <input onChange={setvaluehandler} placeholder='검색어를 입력하세요' />
        </Searchbar>
      </Listselectheaderleft>
      <Listtap onClick={onClick} selectTab={selectTab} />
    </Card>
  )
}

export default Listselectwarp