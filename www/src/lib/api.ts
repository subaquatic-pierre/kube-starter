import axios from 'axios';
import { GET_PROFILE, GET_SPEAKERS, PROFILES } from './endpoints';
import { UserProfile, UserRole, reduceProfile } from 'models/auth';

const strapiHost = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const strapiBackendHost = process.env.BACKEND_STRAPI_API_URL;
const apiToken = process.env.DASHBOARD_STRAPI_API_TOKEN;

export type ApiMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';
export type StrapiResponse<Model = object> = {
  data: Model;
  error?: Partial<object & { message: string }>;
};
export type StrapiRequest = {
  endpoint: string;
  method?: ApiMethod;
  data?: object;
  headers?: object;
};

export const strapiReq = async <Model = object>({
  endpoint,
  method = 'GET',
  data,
  headers,
}: StrapiRequest): Promise<StrapiResponse<Model>> => {
  try {
    const res = await axios.request({
      method: method,
      url: `${strapiHost}${endpoint}`,
      data,
      headers,
    });

    return { data: res.data };
  } catch (e: any) {
    console.log('THERE WAS AN ERROR');
    if (e.response.status === 500) {
      throw new Error(e);
    }
    if (e.response) {
      return e.response.data;
    } else if (e.request) {
      return {
        data: {} as Model,
        error: { message: `${e.request}` },
      };
    } else {
      return { data: {} as Model, error: { message: `${e}` } };
    }
  }
};

// Simple wrapper around strapiReq, adds JWT token to headers
export const strapiReqWithAuth = async <Model = object>({
  endpoint,
  method = 'GET',
  data,
  headers,
}: StrapiRequest): Promise<StrapiResponse<Model>> => {
  const token = window.localStorage.getItem('token');

  if (!token) {
    return { data: {} as Model, error: { message: 'No auth token in client' } };
  }

  const _headers = {
    ...headers,
    Authorization: `Bearer ${token}`,
  };

  return strapiReq({ endpoint, method, data, headers: _headers });
};

export const getProfiles = async (
  endpoint = PROFILES,
): Promise<UserProfile[]> => {
  const res = await strapiReqWithAuth<{ data: any[] }>({
    method: 'GET',
    endpoint: endpoint,
  });

  const profiles = [];

  for (let data of res.data.data) {
    const profile = reduceProfile(data);

    if (profile) {
      profiles.push(profile);
    }
  }

  return profiles;
};

export const getProfile = async (id: string): Promise<UserProfile> => {
  const res = await strapiReqWithAuth<{ data: any }>({
    method: 'GET',
    endpoint: GET_PROFILE(id),
  });

  const data = res.data.data;
  const profile = reduceProfile(data);

  if (profile) {
    return profile;
  }
  return null;
};

export const strapiReqWithApiToken = async <Model = object>({
  endpoint,
  method = 'GET',
  data,
  headers,
}: StrapiRequest): Promise<StrapiResponse<Model>> => {
  const _headers = {
    ...headers,
    Authorization: `bearer ${apiToken}`,
  };

  const res = await axios.request({
    method: method,
    url: `${strapiBackendHost}${endpoint}`,
    data,
    headers: _headers,
  });

  return res;
};

export const strapiReqFromDashWithToken = async <Model = object>({
  endpoint,
  method = 'GET',
  data,
  headers,
}: StrapiRequest): Promise<StrapiResponse<Model>> => {
  const _headers = {
    ...headers,
    Authorization: `bearer ${apiToken}`,
  };

  const res = await axios.request({
    method: method,
    url: `${strapiBackendHost}${endpoint}`,
    data,
    headers: _headers,
  });

  return res;
};
