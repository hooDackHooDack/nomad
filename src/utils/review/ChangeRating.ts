export const ChangeRating = (avr: number) => {
  if (4 < avr) {
    return '매우 만족';
  } else if (3 < avr) {
    return ' 대체로 만족';
  } else if (2 < avr) {
    return '보통';
  } else if (1 < avr) {
    return '불만족 ㅠㅠ';
  } else {
    return '';
  }
};
