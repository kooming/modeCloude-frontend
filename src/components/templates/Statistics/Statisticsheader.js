import React from 'react'
import styled from 'styled-components'
import Text from '../../atoms/Text'
const StatisticsHeaderWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0 30px 10px;
`
const SelectTabWarp = styled.div`
    display: flex;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    .Select-tabs{
    padding: 8px 15px;
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
    }
    .Select-tabs.seleted{
    background: #b881c2;
    color: white;
    }
`

const Statisticsheader = ({ onClick, selectTab }) => {
    return (
        <StatisticsHeaderWrap>
            <div>
                <Text size={"1.8rem"} weight={"bold"}>감정 통계</Text>
            </div>
            <SelectTabWarp>
                <div className={`Select-tabs Weekly-tab ${selectTab === 'weeklytab' ? 'seleted' : ""}`}
                    onClick={() => onClick('weeklytab')}>
                    주간
                </div>
                <div className={`Select-tabs Monthly-tab ${selectTab === 'monthlytab' ? 'seleted' : ""}`}
                    onClick={() => onClick('monthlytab')}>
                    월간
                </div>
                <div className={`Select-tabs Quarterly-tab ${selectTab === 'quarterlytab' ? 'seleted' : ""}`}
                    onClick={() => onClick('quarterlytab')}>
                    분기</div>
                <div className={`Select-tabs Yearly-tab ${selectTab === 'yearlytab' ? 'seleted' : ""}`}
                    onClick={() => onClick('yearlytab')}>
                    연간</div>
            </SelectTabWarp>
        </StatisticsHeaderWrap>
    )
}

export default Statisticsheader