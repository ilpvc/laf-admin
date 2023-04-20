import { service } from "@/utils/http/axios/Axios";
import { Roles } from "@/interface/ApiInterface";


export const getAllRoles = () =>
  service.request({
    url: `/roles/`,
    method: "get",
    params: {},
    data: {}
  });


export const getRolePageConfig = (pageNo: number,
                             pageCount: number) =>
  service.request({
    url: `/roles/pageRoles/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });


export const deleteRoles = (id: number) =>
  service.request({
    url: `/roles/${id}`,
    method: "delete",
    params: {},
    data: {}
  });


export const getRolesById = (id: number) =>
  service.request({
    url: `/roles/${id}`,
    method: "get",
    params: {},
    data: {}
  });

export const addRoles = (params: Roles) =>
  service.request({
    url: `/roles/addRoles`,
    method: "post",
    params: {},
    data: params
  });


export const updateRoles = (params: Roles) =>
  service.request({
    url: `/roles/updateRoles`,
    method: "put",
    params: {},
    data: params
  });

