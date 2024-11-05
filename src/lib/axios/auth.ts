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
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processFailedQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
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

const refreshAccessToken = async (currentToken: string): Promise<string> => {
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

    if (!data.accessToken) {
      throw new Error('No token received');
    }

    return data.accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};

const handleUnauthorized = () => {
  Cookies.remove('accessToken'); // 만료된 토큰 제거

  // 이미 로그인 페이지에 있다면 알림을 표시하지 않음
  if (window.location.pathname.includes('/auth/login')) {
    return;
  }

  alertModal({
    title: '로그인이 필요합니다',
    text: '로그인 페이지로 이동합니다.',
    icon: 'warning',
    confirmButtonText: '확인',
    timer: 3000,
    confirmedFunction: () => {
      window.location.href = '/auth/login';
    },
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
      throw new axios.Cancel('No access token');
    }

    const { isValid, remainingTime } = validateToken(accessToken);

    if (!isValid) {
      throw new axios.Cancel('Token invalid');
    }

    try {
      if (remainingTime < REFRESH_THRESHOLD) {
        if (!isRefreshing) {
          isRefreshing = true;
          const newToken = await refreshAccessToken(accessToken);
          Cookies.set('accessToken', newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          isRefreshing = false;
          processFailedQueue();
        } else {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          const newToken = Cookies.get('accessToken');
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (error) {
      processFailedQueue(error);
      throw error;
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
    const originalRequest = error.config;

    // 토큰 관련 에러 처리
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = Cookies.get('accessToken');

        if (!accessToken) {
          handleUnauthorized();
          return Promise.reject(error);
        }

        try {
          const newToken = await refreshAccessToken(accessToken);
          Cookies.set('accessToken', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return authApi(originalRequest);
        } catch (refreshError) {
          handleUnauthorized();
          return Promise.reject(refreshError);
        }
      }
      handleUnauthorized();
    }

    return Promise.reject(error);
  },
);

export default authApi;
