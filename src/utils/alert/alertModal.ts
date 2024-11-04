import Swal from 'sweetalert2';

interface Props {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  timer?: number;
  willClose?: () => void;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  confirmedFunction?: () => void;
  confirmedDismiss?: () => void; // 취소 버튼 클릭 시 실행될 함수
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
  confirmButtonText = '확인',
  cancelButtonText,
  timer,
  willClose,
  confirmedFunction,
  confirmedDismiss,
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
    willClose: willClose,
  }).then((result) => {
    if (result.isConfirmed && confirmedFunction) {
      confirmedFunction();
    } else if (
      result.dismiss === Swal.DismissReason.cancel &&
      confirmedDismiss
    ) {
      confirmedDismiss();
      console.log('취소되었습니다.');
    }
  });
}
