import React, { useEffect, useRef, useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import happyCloud2 from '../../images/happy2.png';
import manysad from '../../images/슬픔.png';
import middleSad from '../../images/중간슬픔.png';
import defaultCloudImg from '../../images/happy2.png';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

const Wrapper = styled.div`
  position: relative;
  background: linear-gradient(135deg, #f8e1e7, #e1eaf8, #e1f8f4);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  height: 400px;
  overflow: hidden;
`;

const CloudImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
`;

const DiaryImage = styled.img`
  position: absolute;
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 2;
  animation: ${float} 4s ease-in-out infinite;
  cursor: pointer;
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999;
  flex-direction: column;
  color: white;
  text-align: center;
`;

const FullImage = styled.img`
  width: 320px;
  height: 320px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  margin-bottom: 20px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const CloudGallery = () => {
  const { myDiaries = [] } = useSelector((state) => state.diary);

  const allImages = useMemo(() => (
    (myDiaries ?? []).flatMap(diary => {
      let imageList = (diary.images ?? []).map(img =>
        typeof img === 'string' ? img : img?.image_url
      ).filter(Boolean);
  
      if (imageList.length === 0) {
        imageList = [defaultCloudImg];
      }
  
      return imageList.map(img => ({
        url: img,
        title: diary.title || '제목 없음',
        createdAt: diary.createdAt?.slice(0, 10)
      }));
    })
  ), [myDiaries]);
  
  const [visibleImages, setVisibleImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    if (!allImages || allImages.length === 0) return;
    console.log('allImages.length:', allImages.length); 
    const imagesToShow = [];
    imageIndexRef.current = 0;

    const interval = setInterval(() => {
      if (imageIndexRef.current >= allImages.length) {
        clearInterval(interval);
        return;
      }
      imagesToShow.push(allImages[imageIndexRef.current]);
      setVisibleImages([...imagesToShow]); 
      imageIndexRef.current += 1;
    }, 1000);

    return () => clearInterval(interval);
  }, [allImages]);

  const cloudFace =
    visibleImages.length <= 4 ? manysad :
    visibleImages.length < 10 ? middleSad :
    happyCloud2;

  const fixedPositions = [
    { top: '180px', left: '320px' },
    { top: '350px', left: '580px' },
    { top: '70px', left: '400px' },
    { top: '160px', left: '200px' },
    { top: '200px', left: '440px' },
    { top: '310px', left: '340px' },
    { top: '30px', left: '40px' },
    { top: '330px', left: '460px' },
    { top: '50px', left: '280px' },
    { top: '290px', left: '220px' }
  ];

  const showOverlay = (index) => {
    setSelectedIndex(index);
    setOverlayVisible(true);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + visibleImages.length) % visibleImages.length);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % visibleImages.length);
  };

  return (
    <Wrapper>
      <CloudImage src={cloudFace} alt="cloud" />

      {visibleImages.map((img, i) => (  
        img?.url && (
          <DiaryImage
            key={i}
            src={img.url}
            alt={`img-${i}`}
            style={{ ...fixedPositions[i % fixedPositions.length], animationDelay: `${i * 0.3}s` }}
            onClick={() => showOverlay(i)}
          />
        )
      ))}

      <FullscreenOverlay visible={overlayVisible} onClick={() => setOverlayVisible(false)}>
        {visibleImages[selectedIndex] && (
          <>
            <FullImage src={visibleImages[selectedIndex].url} />
            <div>{visibleImages[selectedIndex].title}</div>
            <div>{visibleImages[selectedIndex].createdAt}</div>
            {visibleImages.length > 1 && (
              <NavButtons>
                <NavButton onClick={(e) => { e.stopPropagation(); prevImage(); }}>이전</NavButton>
                <NavButton onClick={(e) => { e.stopPropagation(); nextImage(); }}>다음</NavButton>
              </NavButtons>
            )}
          </>
        )}
      </FullscreenOverlay>
    </Wrapper>
  );
};

export default CloudGallery;
