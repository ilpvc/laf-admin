import { h } from "vue";
import {useAllUserStore} from "@/store/modules/allUser";
import { log } from "echarts/types/src/util/log";

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
    title: "创建者",
    key: "created_by",
    render(row) {
      return h(
        'i',
        {
        },
        allUserStore.getAllUserMap.get(row.created_by) || "不存在"
      );
    },
  },
  {
    title: "创建时间",
    key: "created_time",
    render(row) {
      return h(
        "i",
        {},
        {
          default: () => (row.created_time ? row.created_time : "无")
        }
      );
    }
  },
  {
    title: "修改时间",
    key: "updated_time",
    render(row) {
      return h(
        "i",
        {},
        {
          default: () => (row.updated_time ? row.updated_time : "无")
        }
      );
    }
  }
];
