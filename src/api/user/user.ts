import {http} from '@/utils/http/axios';
import {User, UserQuery} from '@/interface/ApiInterface';
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
  {
    pageNo,
    pageCount,
  }: {
    pageNo: number;
    pageCount: number;
  }
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

export const updateUser = (params: User) =>{
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

export const getUserById = (id: number) =>
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

