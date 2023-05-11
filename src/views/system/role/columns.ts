import { h } from "vue";
import {useAllUserStore} from "@/store/modules/allUser";
import moment from "moment";

const allUserStore = useAllUserStore()
console.log(allUserStore.getAllUserMap);
export const columns = [
  {
    title: "id",
    key: "id"
  },
  {
    title: "角色名称",
    key: "name"
  },
  {
    title: "说明",
    key: "description",
    width: 400
  },

  {
    title: "创建时间",
    key: "createdTime",
    render(row) {
      return h(
        'i',
        {},
        moment(row.createdTime).format("YYYY-MM-DD HH:mm:ss")
      )
    }
  },
  {
    title: "修改时间",
    key: "updatedTime",
    render(row) {
      return h(
        'i',
        {},
        moment(row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
      )
    }
  },
  {
    title: "创建者",
    key: "createdBy",
    render(row) {
      return h(
        'i',
        {},
        allUserStore.getAllUserMap.get(row.createdBy) || "不存在"
      );
    },
  },
];
