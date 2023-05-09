import {h} from 'vue';
import {useAllUserStore} from "@/store/modules/allUser";
import moment from "moment";
import {NTag} from "naive-ui";


const allUserStore = useAllUserStore()
export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: '用户',
    key: 'userId',
    width: 60,
    render(row) {
      return h(
        'i',
        {},
        allUserStore.getAllUserMap.get(row.userId)||'无'
      );
    },
  },
  {
    title: '消息内容',
    key: 'content',
    width: 150,
  },
  {
    title: '消息类型',
    key: 'type',
    width: 150,
    render(row){
      return h(
        NTag,
        {type:'success'},
        row.type===1?'群发':row.type===2?'单发':'用户反馈'
      )
    }
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

];
