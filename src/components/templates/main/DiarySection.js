import styled from 'styled-components';
import DiaryGrid from '../../molecules/main/DiaryGrid';
import { Link } from 'react-router-dom'

const Section = styled.section`
    background:#fff;
    border-radius:15px; 
    padding:25px; margin-bottom:30px;
    box-shadow:0 5px 15px rgba(0,0,0,0.05);
    margin-top: 5vh;
`;
const Title = styled.h3`
    font-size:1.2rem;
    font-weight:600;
    color:#444;
    margin-bottom:20px;
`;
const ViewMore = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 20px;
  color: #b881c2;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function DiarySection({ title, diaries, viewMoreText, onViewMore, viewMoreTo, showWriter }) {
  return (
    <Section>
      <Title>{title}</Title>
      <DiaryGrid diaries={diaries} showWriter={true} />
      {viewMoreText && (
        <ViewMore to={viewMoreTo || '#'}>
          {viewMoreText}
        </ViewMore>
      )}
    </Section>
  );
}
