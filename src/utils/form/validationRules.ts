export const validationRules = {
  email: {
    required: '이메일은 필수 입력입니다',
    pattern: {
      value:
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i,
      message: '잘못된 이메일 형식입니다.',
    },
  },
  password: {
    required: '비밀번호는 필수 입력입니다.',
    minLength: {
      value: 8,
      message: '8자 이상 입력해주세요',
    },
  },
  nickname: {
    required: '닉네임을 입력해주세요',
    minLength: {
      value: 2,
      message: '2자 이상 입력해주세요',
    },
    maxLength: {
      value: 10,
      message: '10자 이하로 작성해주세요',
    },
    pattern: {
      value: /^[가-힣a-zA-Z]*$/,
      message: '한글과 영문만 입력 가능합니다',
    },
  },
};

export const experienceValidationRules = {
  title: {
    required: '제목을 입력해주세요',
    minLength: { value: 5, message: '최소 5자 이상 입력해주세요' },
    maxLength: { value: 50, message: '최대 50자까지 입력 가능합니다' },
  },
  category: {
    required: '카테고리를 선택해주세요',
  },
  description: {
    required: '설명을 입력해주세요',
    minLength: { value: 20, message: '최소 20자 이상 입력해주세요' },
    maxLength: { value: 500, message: '최대 500자까지 입력 가능합니다' },
  },
  address: {
    required: '주소를 입력해주세요',
  },
  bannerImage: {
    required: '배너 이미지를 업로드해주세요',
  },
  price: {
    required: '가격을 입력해주세요',
    min: { value: 0, message: '0원 이상 입력해주세요' },
  },
};