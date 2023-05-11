import {http} from '@/utils/http/axios';
import {LoginParams, Mail, User, UserQuery} from '@/interface/ApiInterface';
import {service} from '@/utils/http/axios/Axios';

http.configAxios({
  baseURL: 'http://localhost:8080/lostandfound',
  timeout: 10000,
});

export function getAllUser() {
  return service.request({
    url: `/user/`,
    method: 'get',
    params: {},
    data: {},
  });
}

export const pageUserCondition = (
  params: UserQuery,
  pageNo: number,
  pageCount: number
) =>
  service({
    url: `/user/pageUserCondition/${pageNo}/${pageCount}`,
    method: 'post',
    params: {},
    data: params,
  });

export const pageConfig = ({pageNo, pageCount}: { pageNo: number; pageCount: number }) =>
  service.request({
    url: `/user/pageUser/${pageNo}/${pageCount}`,
    method: 'get',
    params: {},
    data: {},
  });

export const updateUser = (params: User |any) => {
  console.log(params)
  return service.request({
    url: `/user/updateUser`,
    method: "put",
    params: {},
    data: params
  });
}


export const addUser = (params: User) =>
  service.request({
    url: `/user/addUser`,
    method: "post",
    params: {},
    data: params
  });

export const getUserById = (id: number | any) =>
  service.request({
    url: `/user/${id}`,
    method: "get",
    params: {},
    data: {}
  });

export const deleteUser = (id: number) =>
  service.request({
    url: `/user/${id}`,
    method: "delete",
    params: {},
    data: {}
  });

export const register = (params: LoginParams) =>
  service.request({
    url: `/register/`,
    method: "post",
    params: {},
    data: params
  });

export const getEmailCode = (params: Mail) =>
  service.request<any>({
    url: `/login/mail`,
    method: "post",
    params: {},
    data: params
  });
