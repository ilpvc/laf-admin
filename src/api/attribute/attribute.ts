import {service} from "@/utils/http/axios/Axios";
import { Attribute } from "@/interface/ApiInterface";


export const getQuestionLikeKey = (key: string) =>
  service.request({
    url: `/attribute/like/${key}`,
    method: "get",
    params: {},
    data: {}
  });

export function getByKey(key: string | null) {
  return service({
    url: `/attribute/${key}`,
    method: "get",
    params: {},
    data: {}
  })
}

export function getLikeKey(key: string | null) {
  return service({
    url: `/attribute/like/${key}`,
    method: "get",
    params: {},
    data: {}
  })
}

export function getOnlyKey(key: string | null) {
  return service({
    url: `/attribute/only/${key}`,
    method: "get",
    params: {},
    data: {}
  })
}

export const updateAttrByKey = (params: Attribute) =>
  service.request({
    url: `/attribute/update`,
    method: "post",
    params: {},
    data: params
  });



