import {h} from 'vue';
import {useAllUserStore} from "@/store/modules/allUser";
import moment from "moment";


const allUserStore = useAllUserStore()
export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '用户',
    key: 'commenterId',
    width: 60,
    render(row) {
      return h(
        'i',
        {},
        allUserStore.getAllUserMap.get(row.commenterId)
      );
    },
  },
  {
    title: '评论内容',
    key: 'content',
    width: 150,
  },
  {
    title: '创建时间',
    key: 'createdTime',
    width: 100,
    render(row) {
      return h(
        'i',
        {},
        moment(row.createdTime).format("YYYY-MM-DD HH:mm:ss")
      )
    }
  },

  {
    title: '更新日期',
    key: 'updatedTime',
    width: 100,
    render(row) {
      return h(
        'i',
        {},
        moment(row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
      )
    }
  },
];
