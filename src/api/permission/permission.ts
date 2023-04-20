import {service} from "@/utils/http/axios/Axios";
import {Permissions} from "@/interface/ApiInterface";

export const getAllPermissions = () =>
  service.request({
    url: `/permissions/`,
    method: "get",
    params: {},
    data: {}
  });


export const pagePermission = (pageNo: number,
                               pageCount: number) =>
  service.request({
    url: `/permissions/pagePermissions/${pageNo}/${pageCount}`,
    method: "get",
    params: {},
    data: {}
  });


export const deletePermissions = (id: number) =>
  service.request({
    url: `/permissions/${id}`,
    method: "delete",
    params: {},
    data: {}
  });


export const getPermissionsById = (id: number) =>
  service.request({
    url: `/permissions/${id}`,
    method: "get",
    params: {},
    data: {}
  });


export const addPermissions = (params: Permissions) =>
  service.request({
    url: `/permissions/addPermissions`,
    method: "post",
    params: {},
    data: params
  });


export const updatePermissions = (params: Permissions) =>
  service.request({
    url: `/permissions/updatePermissions`,
    method: "put",
    params: {},
    data: params
  });
