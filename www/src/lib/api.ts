import axios from 'axios';
import { GET_PROFILE, PROFILES } from './endpoints';
import { reduceProfile } from 'models/auth';

const apiHost = process.env.NEXT_PUBLIC_API_URL;

type Object = Record<string, number | string | null>;

export type ApiMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';
export type ApiResponse<Model = Object> = {
  data: Model;
  error?: Partial<Object & { message: string }>;
};
export type ApiRequest = {
  endpoint: string;
  method?: ApiMethod;
  data?: object;
  headers?: object;
};

export const apiReq = async <Model = object>({ endpoint, method = 'GET', data, headers }: ApiRequest): Promise<ApiResponse<Model>> => {
  return axios.request<any, ApiResponse<Model>>({
    method: method,
    url: `${apiHost}${endpoint}`,
    data,
    headers
  });
};

// Simple wrapper around apiReq, adds JWT token to headers
export const apiReqWithAuth = async <Model = object>({
  endpoint,
  method = 'GET',
  data,
  headers
}: ApiRequest): Promise<ApiResponse<Model>> => {
  const token = window.localStorage.getItem('token');

  if (!token) {
    return { data: {} as Model, error: { message: 'No auth token in client' } };
  }

  const _headers = {
    ...headers,
    Authorization: `Bearer ${token}`
  };

  return apiReq({ endpoint, method, data, headers: _headers });
};
