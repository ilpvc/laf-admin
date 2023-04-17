import {service} from "@/utils/http/axios/Axios";


export const getQuestionLikeKey = (key: string) =>
  service.request({
    url: `/attribute/like/${key}`,
    method: "get",
    params: {},
    data: {}
  });
