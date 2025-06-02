export const parseMarkdownWithFallback = (content, imageUrls = []) => {
  if (!content) return '';

  const cleaned = content.replace(/\\/g, '');
  const regex = /!\[.*?\]\((.*?)\)/g;

  let hasImage = false;

  const parsed = cleaned.replace(regex, (match, url) => {
    hasImage = true;
    return `<img src="${url}" alt="이미지" style="max-width:100%; margin-top:20px;" />`;
  });

  if (!hasImage && imageUrls.length > 0) {
    const fallbackImage = `<img src="${imageUrls[0]}" alt="대표 이미지" style="max-width:100%; margin-top:20px;" />`;
    return parsed.replace(/\n/g, '<br />') + fallbackImage;
  }

  return parsed.replace(/\n/g, '<br />');
};
