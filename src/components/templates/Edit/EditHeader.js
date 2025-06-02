import React from 'react'
import Text from '../../atoms/Text'
import styled from 'styled-components'

const EditHeaderWrap = styled.div`
    margin: 30px 0;
    text-align: center;
    .edit-title{
        margin-bottom: 10px;
    }
`

const EditHeader = () => {
    return (
        <EditHeaderWrap>
            <h1 className='edit-title'>
                <Text size={"1.8rem"} color={"#333"} weight={"bold"}>내 정보 관리</Text>
            </h1>
            <p>
                <Text size={"1rem"} color={"#777"}>프로필 정보와 계정 설정을 관리하세요</Text>
            </p>
        </EditHeaderWrap>
    )
}

export default EditHeader