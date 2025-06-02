// src/components/templates/Edit/Profilecontent.js

import React, { useState, useEffect, useCallback, useRef } from 'react'; // useRef 추가
import styled from 'styled-components';
import Text from '../../atoms/Text'; // 실제 경로로 수정해주세요
import Profile from '../../atoms/Profile'; // 실제 경로로 수정해주세요
import Formgroup from '../../molecules/Edit/Formgroup'; // 실제 경로로 수정해주세요
import Button from '../../atoms/Button'; // 실제 경로로 수정해주세요
import Profilesetup from '../../atoms/Edit/Profilesetup'; // 실제 경로로 수정해주세요
import { API_URL } from '../../../constants/api'; // API_URL import 확인
import { useNavigate } from 'react-router-dom';

const ContentStyle = styled.div`
    width: 100%;
    .settings-section-title { /* 클래스명 수정: .-section-title -> .settings-section-title */
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .form-label {
        margin-bottom: 8px;
    }
    .profile-img-container { /* 이미지와 숨겨진 input을 감싸는 컨테이너 */
        position: relative;
        display: inline-block; /* Profile 컴포넌트 크기에 맞게 */
        cursor: pointer; /* 클릭 가능하도록 커서 변경 */
    }
    .hidden-file-input { /* 파일 input 숨기기 */
        display: none;
    }
    .profile-text {
        margin-top: 5px;
        margin-bottom: 20px;
    }
    .button-form {
        margin-top: 30px;
        display: flex;
        gap: 15px;
        justify-content: flex-end;
    }
    .error-message {
        color: red;
        margin-top: 10px;
    }
    .nickname-display-area {
        margin-bottom: 20px;
        padding: 12px 15px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
`;

// --- API 호출 함수들 ---
// fetchUserProfile, updateMyBioOnClient 함수는 이전과 동일하게 사용합니다.

async function fetchUserProfile() {
  const API_BASE_URL = API_URL || '';
  try {
    const response = await fetch(`${API_BASE_URL}/api/setting/me/profile`,{ // 백엔드에 만든 프로필 조회 API 경로
        credentials: 'include'
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '프로필 정보를 불러오는 중 알 수 없는 오류가 발생했습니다.' }));
      throw new Error(errorData.message || '프로필 정보를 불러오는데 실패했습니다.');
    }
    const result = await response.json();
    if (result.success && result.user) {
      return result.user;
    }
    throw new Error(result.message || '프로필 데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

async function updateMyBioOnClient(bioData) {
  const API_BASE_URL = API_URL || '';
  try {
    const response = await fetch(`${API_BASE_URL}/api/setting/me/bio`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bioData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '자기소개 업데이트 중 알 수 없는 오류가 발생했습니다.' }));
      throw new Error(errorData.message || '자기소개 업데이트에 실패했습니다.');
    }
    const result = await response.json();
    if (result.success && result.user) {
      return result.user;
    } else if (result.success) {
        return { bio: bioData.bio, ...result };
    }
    throw new Error(result.message || '자기소개 업데이트 후 데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error("Error updating user bio:", error);
    throw error;
  }
}

// 새로운 API 호출 함수: 프로필 이미지 업로드
async function updateUserProfileImageOnClient(imageData) { // imageData는 FormData 객체
  const API_BASE_URL = API_URL || '';
  try {
    const response = await fetch(`${API_BASE_URL}/api/setting/me/profile-image`, { // 이미지 업로드 API 경로
      method: 'POST',
      credentials: 'include', // 쿠키 전송이 필요하다면
      // 'Content-Type': 'multipart/form-data' 헤더는 FormData 사용 시 브라우저가 자동으로 설정
      body: imageData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '프로필 이미지 업로드 중 알 수 없는 오류가 발생했습니다.' }));
      throw new Error(errorData.message || '프로필 이미지 업로드에 실패했습니다.');
    }
    const result = await response.json();
    // 백엔드가 업데이트된 user 객체 또는 새 이미지 URL을 포함한 객체를 반환한다고 가정
    if (result.success && (result.user || result.profile_image)) {
      return result; // result.user 또는 { profile_image: result.profile_image } 형태
    }
    throw new Error(result.message || '프로필 이미지 업로드 후 데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}
// --- API 호출 함수들 끝 ---


const Profilecontent = () => {
    const navigate = useNavigate();
    const [originalName, setOriginalName] = useState('');
    const [profileImage, setProfileImage] = useState(''); // 현재 DB에 저장된 프로필 이미지 URL
    const [originalBio, setOriginalBio] = useState('');

    const [editedBio, setEditedBio] = useState('');
    const [selectedImageFile, setSelectedImageFile] = useState(null); // 사용자가 새로 선택한 이미지 파일
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);     // 새 이미지 미리보기 URL (또는 현재 이미지 URL)

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null); // 숨겨진 파일 input에 접근하기 위한 ref

    // 초기 데이터 로드
    useEffect(() => {
        const loadProfileData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const userData = await fetchUserProfile();
                const nameFromServer = userData.nickname || userData.nick_name || ''; // 백엔드 응답 필드명 확인
                const bioFromServer = userData.bio || '';
                const imageFromServer = userData.profile || userData.profile_image || null; // 백엔드 응답 필드명 확인
                setProfileImage(imageFromServer);     // DB에 저장된 (카카오) 프로필 이미지 URL
                setImagePreviewUrl(imageFromServer);  // 초기 미리보기도 동일하게 설정

                setOriginalName(nameFromServer);
                setOriginalBio(bioFromServer);
                setProfileImage(imageFromServer);
                setImagePreviewUrl(imageFromServer); // 초기 미리보기도 기존 이미지로

                setEditedBio(bioFromServer);
            } catch (err) {
                setError(err.message || "프로필 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, []);

    const handleBioChange = (e) => setEditedBio(e.target.value);

    // Profile 컴포넌트 또는 연필 아이콘 클릭 시 파일 선택창 열기
    const handleProfileImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 파일이 선택되었을 때 처리
    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB 크기 제한 예시
                alert("이미지 파일 크기는 2MB를 초과할 수 없습니다.");
                return;
            }
            setSelectedImageFile(file); // 선택된 파일 상태에 저장
            // 파일 미리보기 URL 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); // 미리보기 URL 업데이트
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        const bioChanged = editedBio !== originalBio;
        const imageChanged = !!selectedImageFile; // 새 이미지 파일이 선택되었는지

        if (!bioChanged && !imageChanged) {
            alert("변경된 내용이 없습니다.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            let finalUserData = { // 최종적으로 화면 상태를 업데이트할 데이터
                nick_name: originalName, // 이름은 변경되지 않음
                bio: originalBio,
                profile_image: profileImage,
            };

            // 1. 자기소개(Bio) 업데이트 (변경된 경우)
            if (bioChanged) {
                const bioDataToUpdate = { bio: editedBio };
                const bioUpdateResult = await updateMyBioOnClient(bioDataToUpdate);
                finalUserData = {...finalUserData, ...bioUpdateResult.user}; // user 객체로 응답 온다고 가정
                setOriginalBio(finalUserData.bio);
                setEditedBio(finalUserData.bio);
            }

            // 2. 프로필 이미지 업데이트 (새 이미지가 선택된 경우)
            if (imageChanged) {
                const formData = new FormData();
                // 'profileImage'는 백엔드 settings.router.js의 upload.single() 필드명과 일치해야 함
                formData.append('profileImage', selectedImageFile);

                const imageUpdateResult = await updateUserProfileImageOnClient(formData);
                // 백엔드가 { success: true, user: {..., profile_image: 'new_url'} } 또는 { success: true, profile_image: 'new_url' } 형태로 응답한다고 가정
                const newImageUrl = imageUpdateResult.user ? imageUpdateResult.user.profile_image : imageUpdateResult.profile_image;

                finalUserData = {...finalUserData, profile_image: newImageUrl };
                setProfileImage(newImageUrl);
                setImagePreviewUrl(newImageUrl);
                setSelectedImageFile(null); // 파일 선택 상태 초기화
            }
            
            // 모든 작업 성공 후 알림 및 페이지 이동
            alert("프로필이 성공적으로 저장되었습니다!");
            navigate('/mypage'); // 저장 후 이동할 경로 (예: 마이페이지)

        } catch (err) {
            setError(err.message || "프로필 저장 중 오류가 발생했습니다.");
            // 오류 발생 시, 사용자가 수정한 내용을 유지할지, 아니면 원본으로 되돌릴지 결정
            // 예: setImagePreviewUrl(profileImage); // 오류 시 원래 이미지로
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelChanges = useCallback(() => {
        setEditedBio(originalBio);
        setSelectedImageFile(null);
        setImagePreviewUrl(profileImage);
        // 필요하다면 페이지 이동
        // navigate('/mypage');
    }, [originalBio, profileImage, navigate]);


    if (isLoading) { // 초기 전체 데이터 로딩 중일 때
        return <Profilesetup className='profile-wrap'><ContentStyle><div>프로필 정보를 불러오는 중...</div></ContentStyle></Profilesetup>;
    }

    return (
        <Profilesetup className='profile-wrap'>
            <ContentStyle>
                <div className='settings-section-title'>
                    <Text size={"1.3rem"} color={"#444"} weight={"bold"}>프로필 정보</Text>
                </div>

                {error && <div className="error-message">오류: {error}</div>}

                <div className='form-label'>
                    <Text weight={"500"} color={"#555"}>프로필 이미지</Text>
                </div>
                {/* 이미지 클릭 시 파일 선택창 열도록 div로 감싸고 onClick 연결 */}
                <div className='profile-img-container' onClick={handleProfileImageClick} title="프로필 이미지 변경">
                    <Profile isTag={true} imageUrl={imagePreviewUrl} /> {/* 미리보기 URL 사용 */}
                    <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif" // 허용할 이미지 타입
                        className='hidden-file-input'
                        ref={fileInputRef}
                        onChange={handleImageFileChange}
                    />
                </div>
                <div className='profile-text'>
                    <Text size={"0.85rem"} color={"#999"}>프로필 이미지는 JPG, PNG, GIF 형식으로 최대 2MB까지 업로드 가능합니다.</Text>
                </div>

                {/* 닉네임 표시 (수정 불가) */}
                <div className='form-label'>
                    <Text weight={"500"} color={"#555"}>이름</Text>
                </div>
                <div className='nickname-display-area'>
                    <Text>{originalName}</Text>
                </div>
                <div className='form-hint' style={{ marginTop: '5px', marginBottom: '20px' }}>
                    <Text size={"0.85rem"} color={"#999"}>다른 사용자에게 표시되는 이름입니다. (이름 변경은 지원되지 않습니다)</Text>
                </div>

                {/* 자기소개 수정 */}
                <Formgroup
                    isTextarea={true}
                    name={"자기소개"}
                    value={editedBio}
                    onChange={handleBioChange}
                    explanation={"최대 150자까지 입력 가능합니다."}
                />

                <div className='button-form'>
                    <Button onClick={handleCancelChanges} background={"#f0f0f0"} color={"#666"} radius={"8px"} border={"none"} disabled={isSaving}>취소</Button>
                    <Button onClick={handleSaveChanges} background={"#b881c2"} color={"white"} radius={"8px"} border={"none"} disabled={isSaving}>
                        {isSaving ? '저장 중...' : '저장하기'}
                    </Button>
                </div>
            </ContentStyle>
        </Profilesetup>
    );
}

export default Profilecontent;