import { AxiosRequestConfig } from "axios";
import { request } from "@/apis";

export interface NormalizeCallback {
  (data: any, code?: number): void;
}

export function normalizePost(
  ops: AxiosRequestConfig,
  success?: NormalizeCallback,
  error?: NormalizeCallback
): any {
  if (success || error) {
    return request(ops)
      .then(({ data: res }) => {
        if (res.status == 200) {
          success && success(res);
        } else {
          error && error(res);
        }
      })
      .catch(err => {
        error && error(err);
      });
  } else {
    return request(ops);
  }
}
