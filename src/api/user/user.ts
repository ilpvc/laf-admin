import { http } from '@/utils/http/axios';
import { UserQuery } from '@/interface/ApiInterface';
import { service } from '@/utils/http/axios/Axios';

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

export const pageConfig = ({ pageNo, pageCount }: { pageNo: number; pageCount: number }) =>
  http.request({
    url: `/user/pageUser/${pageNo}/${pageCount}`,
    method: 'get',
    params: {},
    data: {},
  });
