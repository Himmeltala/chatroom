import { AxiosRequestConfig } from "axios";
import { request } from "../apis";
import { UserModel } from "../models/userModel";

export interface NormalizeAxiosSuccess {
  (response: any): void;
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

interface NormalizeResponse {
  status?: number;
  data: any;
}

function normalizeThen(res: NormalizeResponse, onSuccess?: NormalizeAxiosSuccess, onError?: NormalizeAxiosError, cluase?: NormalizeCluase) {
  if (res.status == 200 && (cluase ? cluase(res.data) : true)) {
    onSuccess ? onSuccess(res) : "";
  } else {
    onError ? onError(res) : "";
  }
}

export function normalizeGet(ops: NormalizeAxiosOptions, onSuccess?: NormalizeAxiosSuccess, onError?: NormalizeAxiosError, cluase?: NormalizeCluase): void {
  request
    .get(ops.url, ops.config)
    .then(({ data }) => {
      if (data.status == 200 && (cluase ? cluase(data) : true)) {
        onSuccess ? onSuccess(data) : "";
      } else {
        onError ? onError(data) : "";
      }
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}

export function normalizePost(ops: NormalizeAxiosOptions, onSuccess?: NormalizeAxiosSuccess, onError?: NormalizeAxiosError, cluase?: NormalizeCluase): void {
  request
    .post(ops.url, ops.data, ops.config)
    .then(({ data: response }) => {
      normalizeThen(response, onSuccess, onError, cluase);
    })
    .catch((err) => {
      onError ? onError(err) : "";
    });
}
