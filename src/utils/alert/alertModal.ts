import Swal from 'sweetalert2';

interface Props {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  timer?: number;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmedFunction?: () => void;
}

/**
 * @title 모달제목
 * @text 설명텍스트
 * @icon 기본 에니메이션아이콘
 * @showCancelButton 취소버튼 추가할지 말지
 * @cancelButtonText 취소버튼의 텍스트
 * @confirmButtonText 확인버튼의 텍스트
 * @customFunction 확인버튼 눌리면 실행시킬 함수
 * @timer 자동으로 창닫힘 ex)3초->3000
 */

export function alertModal({
  title,
  text,
  icon,
  showCancelButton = false,
  confirmButtonText,
  cancelButtonText,
  timer,
  confirmedFunction,
}: Props) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    timer: timer,
    confirmButtonColor: '#0B3D2D',
    customClass: {
      confirmButton: 'text-[#FAFAFA]',
    },
  }).then((result) => {
    if (result.isConfirmed && confirmedFunction) {
      confirmedFunction();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log('취소되었습니다.');
    }
  });
}
