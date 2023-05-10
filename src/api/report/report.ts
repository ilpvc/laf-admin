import {service} from "@/utils/http/axios/Axios";
import {Report, ReportQuery} from "@/interface/ApiInterface";


export const getReportByCondition = (params: ReportQuery) =>
  service.request({
    url: `/report/condition`,
    method: "post",
    params: {},
    data: params
  });


export const deleteReport = (id: number) =>
  service.request({
    url: `/report/${id}`,
    method: "delete",
    params: {},
    data: {}
  });


export const addReport = (params: Report) =>
  service.request({
    url: `/report/addReport`,
    method: "post",
    params: {},
    data: params
  });


export const updateReport = (params: Report) =>
  service.request({
    url: `/report/updateReport`,
    method: "put",
    params: {},
    data: params
  });

export const pageReportCondition = (
  params: ReportQuery,
  pageNo: number,
  pageCount: number
) =>
  service.request({
    url: `/report/pageReportCondition/${pageNo}/${pageCount}`,
    method: "post",
    params: {},
    data: params
  });
