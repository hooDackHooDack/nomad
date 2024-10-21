import GoogleLogo from '/public/icons/social/google.svg';
import KakaoLogo from '/public/icons/social/kakao.svg';

interface Props {
  text: string;
  googleClick: () => void;
  kakaoClick: () => void;
}

const SocialBox = ({ text, googleClick, kakaoClick }: Props) => {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="relative flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-xl font-regular text-gray-700">
          {text}
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="flex gap-4 justify-center">
        <GoogleLogo onClick={googleClick} className="cursor-pointer" />
        <KakaoLogo onClick={kakaoClick} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default SocialBox;
