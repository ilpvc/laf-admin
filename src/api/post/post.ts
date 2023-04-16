import { service } from '@/utils/http/axios/Axios';
import { PostQuery } from '@/interface/ApiInterface';

export const pagePostCondition = (
  params: PostQuery,
  {
    pageNo,
    pageCount,
  }: {
    pageNo: number;
    pageCount: number;
  }
) =>
  service.request({
    url: `/post/pagePostCondition/${pageNo}/${pageCount}`,
    method: 'post',
    params: {},
    data: params,
  });

export const pagePost = (pageNo: number, pageCount: number) =>
  service.request({
    url: `/post/pagePost/${pageNo}/${pageCount}`,
    method: 'get',
    params: {},
    data: {},
  });
