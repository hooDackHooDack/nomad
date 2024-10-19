import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';
import { logout } from '@/hooks/auth/useAuth';
import { jwtDecode } from 'jwt-decode';
import basicApi from './basic';

interface JWTPayload {
  exp: number;
  iat: number;
  id: number;
  teamId: string;
  iss: string;
}

const REFRESH_THRESHOLD = 5 * 60; // 5분
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 토큰 갱신 중복 방지를 위한 플래그
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 대기 중인 요청들을 처리하는 함수, 새로운 토큰이 발급되면 대기 중이던 모든 요청들에게 새 토큰을 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  // 대기열 초기화
  refreshSubscribers = [];
};

// 토큰 갱신을 기다리는 함수
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// JWT 토큰 검증 및 남은 시간 계산
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

// 토큰 갱신 함수
const refreshAccessToken = async (
  currentToken: string,
): Promise<string | null> => {
  try {
    // 인터셉터 재귀호출 방지를 위한 basicApi 사용
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
    if (!accessToken) return config;

    const { isValid, remainingTime } = validateToken(accessToken);

    // 토큰이 만료된 경우
    if (!isValid) {
      logout();
      throw new Error('Token expired');
    }

    // 만료 시간이 임박한 경우
    if (remainingTime < REFRESH_THRESHOLD) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken(accessToken); // 현재 토큰 전달
          if (newToken) {
            Cookies.set('accessToken', newToken);
            onRefreshed(newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
          } else {
            logout();
            throw new Error('Token refresh failed');
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // 이미 토큰 갱신 중인 경우, 새로운 토큰을 기다림
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

// 응답 인터셉터 추가
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  },
);

export default authApi;
