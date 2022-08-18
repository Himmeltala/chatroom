import { request } from "./index";
import { UserModel } from "../models/userModel";

export function checkUser(
  data: any,
  onSuccess: (e: Array<UserModel>, status: number) => void,
  onError?: (e: any) => void
) {
  request
    .post("/login", data, {
      withCredentials: true,
    })
    .then(({ data: res }) => {
      if (res.data.length !== 0 && res.status == 200) {
        onSuccess(res.data, res.status);
      } else {
        onError ? onError(res) : "";
      }
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}
