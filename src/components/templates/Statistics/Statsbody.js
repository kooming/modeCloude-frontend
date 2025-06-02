import React from 'react';
import EmotionCalendar from '../../molecules/Statistics/EmotionCalendar';


const Statsbody = ({ filteredEmotionData, activeStartDate, onActiveStartDateChange, selectTab }) => {
  return (
    <div>
        <EmotionCalendar
            emotionDataForCalendar={filteredEmotionData} // props 이름 명확히 변경
            currentActiveStartDate={activeStartDate}    // props 이름 명확히 변경
            onCalendarNavigate={onActiveStartDateChange} // props 이름 명확히 변경
            currentSelectTab={selectTab}                 // props 이름 명확히 변경
        />
    </div>
  );
};

export default Statsbody;