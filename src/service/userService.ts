import { AxiosRequestConfig } from "axios";
import { request } from "@/apis/config";
import UserModel from "@/models/userModel";

export interface NormalizeAxiosSuccess {
  (response: NormalizeResponse): void;
}

interface NormalizeResponse {
  status?: number;
  data: any;
}

export interface NormalizeAxiosError {
  (error: any): void;
}

export interface NormalizeAxiosOptions {
  url: string;
  data?: UserModel;
  config?: AxiosRequestConfig;
}

export function normalizeGet(
  ops: NormalizeAxiosOptions,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  if (success || error) {
    return request
      .get(ops.url, ops.config)
      .then(({ data: res }) => {
        if (res.status == 200) {
          success ? success(res) : "";
        } else {
          error ? error(res) : "";
        }
      })
      .catch(err => {
        error ? error(err) : "";
      });
  } else {
    return request.get(ops.url, ops.config);
  }
}

export function normalizePost(
  ops: NormalizeAxiosOptions,
  success?: NormalizeAxiosSuccess,
  error?: NormalizeAxiosError
): any {
  if (success || error) {
    return request
      .post(ops.url, ops.data, ops.config)
      .then(({ data: res }) => {
        if (res.status == 200) {
          success ? success(res) : "";
        } else {
          error ? error(res) : "";
        }
      })
      .catch(err => {
        error ? error(err) : "";
      });
  } else {
    return request.post(ops.url, ops.data, ops.config);
  }
}
