import { AxiosRequestConfig } from "axios";
import { request } from "../apis";
import { UserModel } from "../models/userModel";

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

interface NormalizeCluase {
  (data: any): boolean;
}

function handleAxiosThen(res: NormalizeResponse, success?: NormalizeAxiosSuccess, error?: NormalizeAxiosError, cluase?: NormalizeCluase): void {
  if (res.status == 200 && (cluase ? cluase(res.data) : true)) {
    success ? success(res) : "";
  } else {
    error ? error(res) : "";
  }
}

export function normalizeGet(ops: NormalizeAxiosOptions, success?: NormalizeAxiosSuccess, error?: NormalizeAxiosError, cluase?: NormalizeCluase): void {
  request
    .get(ops.url, ops.config)
    .then(({ data: response }) => {
      handleAxiosThen(response, success, error, cluase);
    })
    .catch(err => {
      error ? error(err) : "";
    });
}

export function normalizePost(ops: NormalizeAxiosOptions, success?: NormalizeAxiosSuccess, error?: NormalizeAxiosError, cluase?: NormalizeCluase): void {
  request
    .post(ops.url, ops.data, ops.config)
    .then(({ data: response }) => {
      handleAxiosThen(response, success, error, cluase);
    })
    .catch(err => {
      error ? error(err) : "";
    });
}
