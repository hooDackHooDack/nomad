import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import basicApi from './basic';
import { alertModal } from '@/utils/alert/alertModal';

interface JWTPayload {
  exp: number;
  iat: number;
  id: number;
  teamId: string;
  iss: string;
}

const REFRESH_THRESHOLD = 5 * 60; // 5분
const baseURL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const validateToken = (
  token: string,
): { isValid: boolean; remainingTime: number } => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - now;
    return {
      isValid: remainingTime > 0,
      remainingTime,
    };
  } catch (error) {
    console.error('토큰 검증 실패:', error);
    return { isValid: false, remainingTime: 0 };
  }
};

const refreshAccessToken = async (
  currentToken: string,
): Promise<string | null> => {
  try {
    const { data } = await basicApi.post<{ accessToken: string }>(
      '/auth/tokens',
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      },
    );

    return data.accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return null;
  }
};

const handleUnauthorized = () => {
  const redirectToLogin = () => {
    window.location.href = '/auth/login';
  };

  alertModal({
    title: '로그인이 필요합니다',
    text: '로그인 페이지로 이동합니다.',
    icon: 'warning',
    confirmButtonText: '확인',
    timer: 3000,
    confirmedFunction: redirectToLogin,
    // willClose callback을 추가하여 모달이 닫힐 때도 리다이렉트
    willClose: redirectToLogin,
  });
};

const authApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

authApi.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      handleUnauthorized();
      return config;
    }

    const { isValid, remainingTime } = validateToken(accessToken);

    if (!isValid) {
      handleUnauthorized();
      throw new Error('Token expired');
    }

    if (remainingTime < REFRESH_THRESHOLD) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken(accessToken);
          if (newToken) {
            Cookies.set('accessToken', newToken);
            onRefreshed(newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
          } else {
            handleUnauthorized();
            throw new Error('Token refresh failed');
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise<string>((resolve) => {
          addRefreshSubscriber(resolve);
        });
        config.headers.Authorization = `Bearer ${newToken}`;
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === 'Unauthorized'
    ) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default authApi;
