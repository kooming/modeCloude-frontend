import styled from 'styled-components';
import DiaryCard from './DiaryCard';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default function DiaryGrid({ diaries }) {
  return (
    <Grid>
      {diaries?.map((d) => {
        if (!d || !d.createdAt) return null;

        return (
          <DiaryCard
            key={d.id}
            diary={d} 
            date={d.createdAt.slice(0, 10)}
            title={d.title}
            preview={d.content?.slice(0, 80) || ''}
            moodColor={d.emotion?.color}
            moodLabel={d.emotion?.name}
            visibility={d.isPublic ? '공개' : '비공개'}
            comments={d.commentCount}
            showWriter={true}
            writer={d.writer}
          />
        );
      })}
    </Grid>
  );
}