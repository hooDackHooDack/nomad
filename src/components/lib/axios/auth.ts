// authApi.ts
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { logout } from '@/hooks/auth/useAuth';

const HOUR_IN_MS = 60 * 60 * 1000; // 1시간
const TOKEN_WINDOW = 30 * 60 * 1000; // 30분

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const authApi: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 토큰 갱신 함수
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await authApi.post<{ accessToken: string }>(
      '/auth/tokens',
      {},
    );
    return data.accessToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    return null;
  }
};

authApi.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return config;

    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return config;

    const now = Date.now();
    const timeElapsed = now - parseInt(loginTime);

    // 로그인 후 1시간이 지났는지 확인
    if (timeElapsed >= HOUR_IN_MS) {
      // 1시간 30분이 지났으면 로그아웃
      if (timeElapsed >= HOUR_IN_MS + TOKEN_WINDOW) {
        logout();
        throw new Error('Session expired');
      }

      // 1시간~1시간 30분 사이면 토큰 갱신
      const newToken = await refreshAccessToken();
      if (newToken) {
        Cookies.set('accessToken', newToken);
        localStorage.setItem('loginTime', now.toString());
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        logout();
        throw new Error('Token refresh failed');
      }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem('lastAuthApiCall', now.toString());
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default authApi;
