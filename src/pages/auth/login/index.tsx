import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '@/components/authForm/LoginForm';
import SignUpForm from '@/components/authForm/SignUpForm';
import Logo from '/public/logo/logo_col_white.svg';

const Index = () => {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // URL 경로에 따라 초기 상태 설정
  useEffect(() => {
    if (router.pathname === '/auth/sign-up') {
      setIsRightPanelActive(true);
    } else {
      setIsRightPanelActive(false);
    }
  }, [router.pathname]);

  const togglePanel = () => {
    const newState = !isRightPanelActive;
    setIsRightPanelActive(newState);
    // URL 변경
    router.push(newState ? '/auth/sign-up' : '/auth/login', undefined, {
      shallow: true,
    });
  };
  return (
    <div className="flex justify-center items-center p-5 h-screen">
      {/* 모바일 버전 전환 버튼 */}
      <div className="sm:block hidden fixed top-3 right-5 z-[200]">
        <button
          onClick={togglePanel}
          className="bg-green-dark text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-light transition-colors"
        >
          {isRightPanelActive ? '로그인 하기' : '회원가입 하기'}
        </button>
      </div>

      <div
        className={`bg-white rounded-lg shadow-auth
          relative overflow-hidden w-[1200px] max-w-full 
          sm:min-h-[800px] min-h-[810px]`}
      >
        {/* Sign Up Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-300 p-5 bg-white 
            flex items-center justify-center left-0 
            ${
              isRightPanelActive
                ? 'opacity-100 z-[5] translate-x-full sm:translate-x-0'
                : 'opacity-0 z-[1] translate-x-0 sm:-translate-x-full'
            }
            ${!isRightPanelActive && 'sm:opacity-0'}
            sm:w-full w-1/2 `}
        >
          <SignUpForm />
        </div>

        {/* Sign In Container */}
        <div
          className={`absolute top-0 h-full transition-all duration-300 p-5 bg-white 
            flex items-center justify-center left-0 w-1/2 z-[2]
            ${
              isRightPanelActive
                ? 'translate-x-full sm:-translate-x-full'
                : 'translate-x-0 sm:translate-x-0'
            }
            ${isRightPanelActive && 'sm:opacity-0'}
            sm:w-full`}
        >
          <LoginForm />
        </div>

        {/* Overlay Container - sm시, 제거 */}
        <div className="sm:hidden">
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden 
              transition-transform duration-600 z-[100]
              ${isRightPanelActive ? '-translate-x-full' : ''}`}
          >
            <div
              className={`bg-green-dark bg-no-repeat 
                bg-cover bg-[0_0] text-white relative -left-full h-full w-[200%] 
                transform transition-transform duration-600
                ${isRightPanelActive ? 'translate-x-1/2' : ''}`}
            >
              <div
                className={`absolute flex items-center justify-center flex-col p-10 
                  text-center top-0 h-full w-1/2 -translate-x-[20%] transition-transform 
                  duration-600 ${isRightPanelActive ? 'translate-x-0' : ''}`}
              >
                <Logo />
                <h1 className="text-white text-2xl font-bold mb-4 mt-8">
                  Welcome Back!
                </h1>
                <p className="text-white mb-6">
                  이미 회원이신가요? 아래의 로그인 버튼을 클릭해주세요!
                </p>
                <button
                  className="bg-transparent border border-white text-white text-sm font-bold 
                    py-3 px-11 uppercase tracking-wider rounded-[20px] transition-transform 
                    duration-80 hover:bg-white hover:text-green-dark cursor-pointer"
                  onClick={togglePanel}
                >
                  로그인 하기
                </button>
              </div>

              <div
                className={`absolute flex items-center justify-center flex-col p-10 
                  text-center top-0 h-full w-1/2 right-0 transition-transform duration-600
                  ${isRightPanelActive ? 'translate-x-[20%]' : ''}`}
              >
                <Logo />
                <h1 className="text-white text-2xl font-bold mb-4 mt-8">
                  Hello, Friend!
                </h1>
                <p className="text-white mb-6">
                  처음 방문이신가요? 아래의 회원가입 버튼을 클릭해주세요!
                </p>
                <button
                  className="bg-transparent border border-white text-white text-sm font-bold 
                    py-3 px-11 uppercase tracking-wider rounded-[20px] transition-transform 
                    duration-80 hover:bg-white hover:text-green-dark cursor-pointer"
                  onClick={togglePanel}
                >
                  회원가입 하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
