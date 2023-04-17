import {service} from "@/utils/http/axios/Axios";
import {Tasks} from "@/interface/ApiInterface";


export const pageTask = (
  pageNo: number,
  pageCount: number
) =>
  service.request({
    url: `/tasks/pageTasks/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });


export const addTasks = (params: Tasks) =>
  service.request({
    url: `/tasks/addTasks`,
    method: "post",
    params: {},
    data: params
  });


export const deleteTasks = (id: number) =>
  service.request({
    url: `/tasks/${id}`,
    method: "delete",
    params: {},
    data: {}
  });


export const updateTasks = (params: Tasks) =>
  service.request({
    url: `/tasks/updateTasks`,
    method: "put",
    params: {},
    data: params
  });
