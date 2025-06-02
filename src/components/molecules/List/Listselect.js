import React from 'react'
import Selectid from '../../atoms/List/Selectid'
import Text from '../../atoms/Text'
import styled from 'styled-components'
const Listwarp = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`

const Listselect = ({children,selects,values, onEvent}) => {
  return (
    <Listwarp>
        <Text>{children}</Text>
        <Selectid onChange ={(e)=>onEvent(e.target.value)} values={values} content={selects}></Selectid>
    </Listwarp>
  )
}

export default Listselect