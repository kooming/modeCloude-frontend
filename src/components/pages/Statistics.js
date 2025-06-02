// Statistics.js
import React, { useState, useEffect } from 'react';
import Header from '../templates/Header';
import styled from 'styled-components';
import Statisticsheader from '../templates/Statistics/Statisticsheader';
import Statslayout from '../templates/Statistics/Statslayout';
import Statsbody from '../templates/Statistics/Statsbody'; // 경로 확인
import DiaryCheckContent from '../molecules/Statistics/DiaryCheckContent';
// import { myDiaryData } from '../../data/Dummydiarydata'; // 경로 확인
import axios from 'axios';
import { API_URL } from '../../constants/api';

const StatisticsWarp = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
`;

// Statsbody(달력)와 DiaryCheckContent(일기작성활동)를 나란히 배치하기 위한 컨테이너
const BottomContentRow = styled.div`
  display: flex;
  gap: 24px; // 두 컴포넌트 사이의 간격
  align-items: flex-start; // 상단 정렬
  margin-top: 24px; // 위의 Statslayout과의 간격
  flex-wrap: wrap; // 화면 너비가 부족할 때 다음 줄로 넘어가도록
  justify-content: center;
  padding-bottom: 50px;

  // 각 자식 요소가 차지할 공간을 정의합니다.
  // 예시: 왼쪽 달력은 더 넓게, 오른쪽 DiaryCheckContent는 고정 너비
  & > .calendar-area { // Statsbody를 감싸는 div에 이 클래스 적용
    min-width: 300px; // 달력의 최소 너비 (반응형 고려)
  }
  & > .activity-tracker-area { // DiaryCheckContent를 감싸는 div에 이 클래스 적용
    width: 395px;
  }

  // 만약 동일한 비율로 나누고 싶다면:
  /*
  & > * {
    flex: 1 1 calc(50% - 12px); // 간격을 제외한 50%씩 차지 시도
    min-width: 300px; // 최소 너비
  }
  */
`;

const Statistics = () => {
    const [selectTab, setSelectTab] = useState("monthlytab");
    const [myDiaryData, setMyDiaryData] = useState([]);
    const today = new Date(); // 오늘 날짜 기준으로 초기값 설정
    const [activeStartDate, setActiveStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [filteredData, setFilteredData] = useState([]);

    const getData = async () => {
        const { data } = await axios.get(`${API_URL}/list`, { withCredentials: true });
        const result = data.map(el => {
            return {
                date: new Date(el.createdAt).toISOString().slice(0, 10).replace(/-/g, '.'),
                description: el.content,
                emotion: el.emotion.id,
                id: el.id,
                title: el.title,
                type: el.isPublic ? "public" : "private"
            };
        })
        console.log(result);
        setMyDiaryData(result);
    }

    const diarydataApi = async () => {
        const { data } = await axios.get("https://devops1.store/Main/emotionAll")
        console.log(data)
        return data;
    }

    useEffect(() => {
        diarydataApi();
        getData();
    }, [])

    const handleTabClick = (tabName) => {
        setSelectTab(tabName);
        const newToday = new Date(); // 항상 최신 '오늘' 날짜 기준
        if (tabName === 'weeklytab') {
            setActiveStartDate(newToday);
        } else if (tabName === 'monthlytab') {
            setActiveStartDate(new Date(newToday.getFullYear(), newToday.getMonth(), 1));
        } else if (tabName === 'quarterlytab') {
            const currentMonth = newToday.getMonth();
            const firstMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
            setActiveStartDate(new Date(newToday.getFullYear(), firstMonthOfQuarter, 1));
        } else if (tabName === 'yearlytab') {
            setActiveStartDate(new Date(newToday.getFullYear(), 0, 1));
        }
    };

    const handleActiveStartDateChange = (newDate) => {
        // newDate가 유효한 Date 객체인지 확인 후 업데이트
        if (newDate instanceof Date && !isNaN(newDate)) {
            setActiveStartDate(newDate);
        } else {
            console.warn("Invalid date passed to handleActiveStartDateChange:", newDate);
        }
    };

    useEffect(() => {
        // activeStartDate가 유효한 Date 객체인지 먼저 확인
        if (!(activeStartDate instanceof Date && !isNaN(activeStartDate))) {
            console.error("useEffect: Invalid activeStartDate, skipping filtering.", activeStartDate);
            setFilteredData([]); // 유효하지 않으면 빈 데이터 처리
            return;
        }

        // console.log("--- Debugging Statistics.js (Data Update) ---");
        // console.log("Current selectTab:", selectTab);
        // console.log(`Current activeStartDate details: Year=${activeStartDate.getFullYear()}, Month=${activeStartDate.getMonth() + 1}, Date=${activeStartDate.getDate()}`);

        let newFilteredData = [];
        const currentYear = activeStartDate.getFullYear();
        const currentMonth = activeStartDate.getMonth(); // 0-11

        let startOfWeekForFilter, endOfWeekForFilter;
        if (selectTab === 'weeklytab') {
            startOfWeekForFilter = new Date(activeStartDate);
            const dayOfWeek = startOfWeekForFilter.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            startOfWeekForFilter.setDate(startOfWeekForFilter.getDate() + diff);
            startOfWeekForFilter.setHours(0, 0, 0, 0);

            endOfWeekForFilter = new Date(startOfWeekForFilter);
            endOfWeekForFilter.setDate(startOfWeekForFilter.getDate() + 6);
            endOfWeekForFilter.setHours(23, 59, 59, 999);
            // console.log(`  [Weekly Filter Range] Target Week: ${startOfWeekForFilter.toLocaleDateString('ko-KR')} - ${endOfWeekForFilter.toLocaleDateString('ko-KR')}`);
        }

        if (myDiaryData && Array.isArray(myDiaryData)) {
            myDiaryData.forEach(item => {
                if (!item || typeof item.date !== 'string' || !item.emotion) {
                    return;
                }
                const itemDateParts = item.date.split('.');
                if (itemDateParts.length !== 3) {
                    return;
                }
                const itemYear = parseInt(itemDateParts[0], 10);
                const itemMonth = parseInt(itemDateParts[1], 10) - 1;
                const itemDay = parseInt(itemDateParts[2], 10);

                if (isNaN(itemYear) || isNaN(itemMonth) || isNaN(itemDay)) {
                    return;
                }
                const diaryEntryDate = new Date(itemYear, itemMonth, itemDay);
                if (isNaN(diaryEntryDate.getTime())) {
                    return;
                }

                let match = false;

                if (selectTab === 'monthlytab') {
                    if (itemYear === currentYear && itemMonth === currentMonth) {
                        match = true;
                    }
                } else if (selectTab === 'weeklytab') {
                    if (startOfWeekForFilter instanceof Date && !isNaN(startOfWeekForFilter) &&
                        endOfWeekForFilter instanceof Date && !isNaN(endOfWeekForFilter) &&
                        diaryEntryDate >= startOfWeekForFilter && diaryEntryDate <= endOfWeekForFilter) {
                        match = true;
                    }
                } else if (selectTab === 'quarterlytab') {
                    const firstMonthOfQuarter = Math.floor(currentMonth / 3) * 3;
                    if (itemYear === currentYear && itemMonth >= firstMonthOfQuarter && itemMonth < firstMonthOfQuarter + 3) {
                        match = true;
                    }
                } else if (selectTab === 'yearlytab') {
                    if (itemYear === currentYear) {
                        match = true;
                    }
                }

                if (match) {
                    newFilteredData.push(item);
                }
            });
        }

        // console.log("Filtered data for", selectTab, ":", newFilteredData);
        setFilteredData(newFilteredData);
        // console.log("--- End Debugging ---");

    }, [selectTab, activeStartDate]);

    return (
        <StatisticsWarp> {/* Header가 StatisticsWarp 안에 있을 수도, 바깥에 있을 수도 있습니다. 현재는 안에 배치. */}
            <Header />
            <Statisticsheader onClick={handleTabClick} selectTab={selectTab} />
            <Statslayout filteredEmotionData={filteredData} /> {/* 감정분포, 감정순위 카드 */}

            <BottomContentRow>
                <div className="calendar-area"> {/* 달력 영역 */}
                    <Statsbody
                        filteredEmotionData={filteredData}
                        activeStartDate={activeStartDate}
                        onActiveStartDateChange={handleActiveStartDateChange}
                        selectTab={selectTab}
                    />
                </div>
                <div className="activity-tracker-area"> {/* 일기 작성 활동 영역 */}
                    <DiaryCheckContent
                        myDiaryData={myDiaryData}
                        filteredData={filteredData}
                        activeStartDate={activeStartDate}
                        selectTab={selectTab}
                    />
                </div>
            </BottomContentRow>
        </StatisticsWarp>
    );
};

export default Statistics;