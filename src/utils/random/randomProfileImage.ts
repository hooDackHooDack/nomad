export const profileImages = {
  men: [
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732011327.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732044588.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732066128.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732096217.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732109069.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732122947.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732134149.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732146291.png',
  ],
  women: [
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732160335.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732172210.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732185599.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732195064.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732209617.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732219993.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732230201.png',
    'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/profile_image/7-4_1143_1730732240986.png',
  ],
};

export const getRandomProfileImage = () => {
  const allImages = [...profileImages.men, ...profileImages.women];
  const randomIndex = Math.floor(Math.random() * allImages.length);
  return allImages[randomIndex];
};
