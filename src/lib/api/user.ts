import { UserInfo } from "@/types/user/userInfo";
import authApi from "../axios/auth";

export const getUser = async () => {
  return authApi.get<UserInfo>('/users/me');
}