import { normalizePost, NormalizeAxiosError, NormalizeAxiosSuccess } from "@/service/userService";
import UserModel from "@/models/userModel";

export function checkUser(
  data: UserModel,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  return normalizePost({ url: "/login", data, config: { withCredentials: true } }, success, error);
}

export function updateUser(
  data: UserModel,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  return normalizePost({ url: "/update/user", data }, success, error);
}

export function queryFriends(
  data: UserModel,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  return normalizePost({ url: "/query/friends", data }, success, error);
}

export function queryGroups(
  data: UserModel,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  return normalizePost({ url: "/query/groups", data }, success, error);
}
