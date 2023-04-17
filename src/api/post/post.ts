import { service } from "@/utils/http/axios/Axios";
import { Post, PostQuery } from "@/interface/ApiInterface";

export const pagePostCondition = (
  params: PostQuery,
  {
    pageNo,
    pageCount
  }: {
    pageNo: number;
    pageCount: number;
  }
) =>
  service.request({
    url: `/post/pagePostCondition/${pageNo}/${pageCount}`,
    method: "post",
    params: {},
    data: params
  });

export const pagePost = (pageNo: number, pageCount: number) =>
  service.request({
    url: `/post/pagePost/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });


export const updatePost = (params: Post) =>
  service.request({
    url: `/post/updateUser`,
    method: "put",
    params: {},
    data: params
  });


export const addPost = (params: Post) =>
  service.request({
    url: `/post/addPost`,
    method: "post",
    params: {},
    data: params
  });

export function getAllNormalPost() {
  let params: PostQuery = {};
  params.status = [1, 5];
  return service({
    url: `/post/condition`,
    method: "post",
    params: {},
    data: params
  });

}

export const deletePost = (id: number) =>
  service.request({
    url: `/post/${id}`,
    method: "delete",
    params: {},
    data: {}
  });
