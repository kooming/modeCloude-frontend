import React from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  display: inline-block;
`;

const StyledSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 8px 35px 8px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  background-color: #f9f9f9;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;

  /* ✅ 화살표 아이콘 */
  background-image: url("data:image/svg+xml,%3Csvg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
`;

const Selectid = ({ content = [] , values, onChange}) => {
  return (
    <SelectWrapper>
      <StyledSelect onChange={onChange}>
        {content.map((el, i) => (
          <option key={i} value={values[i]}>{el}</option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
};

export default Selectid;
