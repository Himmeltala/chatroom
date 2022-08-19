import { normalizePost, NormalizeAxiosError, NormalizeAxiosSuccess } from "../service/userService";
import { UserModel } from "../models/userModel";

export function checkUser(data: UserModel, onSuccess?: NormalizeAxiosSuccess, onError?: NormalizeAxiosError) {
  normalizePost({ url: "/login", data: data, config: { withCredentials: true } }, onSuccess, onError, (e) => e.length !== 0);
}

export function updateUser(data: UserModel, onSuccess?: NormalizeAxiosSuccess, onError?: NormalizeAxiosError) {
  normalizePost({ url: "/update/user", data: data }, onSuccess, onError);
}

export function queryFriends(data: UserModel, onSuccess: NormalizeAxiosSuccess, onError?: NormalizeAxiosError) {
  normalizePost({ url: "/query/friends", data: data }, onSuccess, onError);
}
