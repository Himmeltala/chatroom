import { normalizePost, NormalizeCallback } from "@/service/userService";
import { UserModel } from "@/models";

export function checkUser(
  data: UserModel,
  success?: NormalizeCallback,
  error?: NormalizeCallback
): any {
  return normalizePost(
    { method: "post", url: "/login", data, withCredentials: true },
    success,
    error
  );
}

export function updateUser(
  data: UserModel,
  success?: NormalizeCallback,
  error?: NormalizeCallback
): any {
  return normalizePost({ method: "post", url: "/update/user", data }, success, error);
}

export function queryFriends(
  data: UserModel,
  success?: NormalizeCallback,
  error?: NormalizeCallback
): any {
  return normalizePost({ method: "post", url: "/query/friends", data }, success, error);
}

export function queryGroups(
  data: UserModel,
  success?: NormalizeCallback,
  error?: NormalizeCallback
): any {
  return normalizePost({ method: "post", url: "/query/groups", data }, success, error);
}
