import { service } from "@/utils/http/axios/Axios";
import { Post, PostQuery } from "@/interface/ApiInterface";

export function getAllPosts() {
  return service({
    url: `/post/`,
    method: "get",
    params: {},
    data: {}
  })
}

export function getPostByCondition(params: PostQuery) {
  return service({
    url: `/post/condition`,
    method: "post",
    params: {},
    data: params
  })

}

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
  let params: PostQuery = {}
  params.status = [1]
  params.types=[1,2,3]
  return service({
    url: `/post/normalCondition`,
    method: "post",
    params: {},
    data: params
  })

}

export const getPagePost = (pageNo: number, pageCount: number) =>
  service.request({
    url: `/post/pagePost/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });


export const deletePost = (id: number) =>
  service.request({
    url: `/post/${id}`,
    method: "delete",
    params: {},
    data: {}
  });


export const getPostById = (id: number|undefined) =>
  service.request({
    url: `/post/${id}`,
    method: "get",
    params: {},
    data: {}
  });


export const pagePostCondition = (
  params: PostQuery,
  pageNo: number,
  pageCount: number
) =>
  service.request({
    url: `/post/pagePostCondition/${pageNo}/${pageCount}`,
    method: "post",
    params: {},
    data: params
  });


export const PostNormalCondition = (params: PostQuery) =>
  service.request({
    url: `/post/normalCondition`,
    method: "post",
    params: {},
    data: params
  });


export const getRankPost = (params: PostQuery) =>
  service.request({
    url: `/post/rank`,
    method: "post",
    params: {},
    data: params
  });

