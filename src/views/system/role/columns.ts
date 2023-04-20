import { h } from "vue";
import {useAllUserStore} from "@/store/modules/allUser";

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
        "i",
        {},
        {
          default: () => (row.createdTime ? row.createdTime : "无")
        }
      );
    }
  },
  {
    title: "修改时间",
    key: "updatedTime",
    render(row) {
      return h(
        "i",
        {},
        {
          default: () => (row.updatedTime ? row.updatedTime : "无")
        }
      );
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
