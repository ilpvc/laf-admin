import {MessageQuery} from "@/interface/ApiInterface";
import {service} from "@/utils/http/axios/Axios";
import {Message} from "postcss";


export const pageMessageCondition = (
  params: MessageQuery,
  pageNo: number,
  pageCount: number
) =>
  service.request({
    url: `/message/pageMessageCondition/${pageNo}/${pageCount}`,
    method: "post",
    params: {},
    data: params
  });

export const getAllMessages = () =>
  service.request({
    url: `/message/`,
    method: "get",
    params: {},
    data: {}
  });

export const deleteMessageById = () =>
  service.request({
    url: `/message/delete`,
    method: "delete",
    params: {},
    data: {}
  });

export const pageMessageConfig = (pageNo: number, pageCount: number) =>
  service.request({
    url: `/message/pageMessage/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });

export const getMessageById = (id: number) =>
  service.request({
    url: `/message/${id}`,
    method: "get",
    params: {},
    data: {}
  });

export const addMessage = (params: Message) =>
  service.request({
    url: `/message/addMessage`,
    method: "post",
    params: {},
    data: params
  });


export const updateMessage = (params: Message) =>
  service.request({
    url: `/message/updateMessage`,
    method: "put",
    params: {},
    data: params
  });


export const getMessageByCondition = (params: MessageQuery) =>
  service.request({
    url: `/message/condition`,
    method: "post",
    params: {},
    data: params
  });
