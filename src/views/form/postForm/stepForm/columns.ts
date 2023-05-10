import {h} from 'vue';
import {NTag} from 'naive-ui';
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
    title: '类型',
    key: 'type',
    width: 60,
    render(row) {
      return h(
        NTag,
        {
          type: row.type === 1 ? 'error' : row.type === 2 ? 'success' : 'info',
        },
        () => {
          switch (row.type) {
            case 1:
              return '失物贴';
            case 2:
              return '招领贴';
            case 3:
              return '其他贴';
          }
        }
      );
    },
  },
  {
    title: '标题',
    key: 'title',
    width: 100,
  },
  {
    title: '帖子内容',
    key: 'content',
    width: 150,
  },
  {
    title: '浏览量',
    key: 'count',
    width: 50,
  },
  {
    title: '发帖人',
    key: 'userId',
    width: 100,
    render(row) {
      return h(
        'i',
        {},
        allUserStore.getAllUserMap.get(row.userId) || "不存在"
      );
    },
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 1 || row.status === 5 ? 'success' : row.status === 2 ? 'info' : row.status === 3 ? 'warning' : 'error',
        },
        row.status === 1 ? '正常' : row.status === 2 ? '待审核' : row.status === 3 ? '已删除' : row.status === 4?'已禁用':'已完成'
      );
    },
    width: 100,
  },
  {
    title: '创建时间',
    key: 'createdTime',
    width: 100,
    render(row) {
      return h(
        "i",
        {},
        moment(row.createdTime).format("YYYY-MM-DD HH:mm:ss")
      );
    }
  },

  {
    title: '更新日期',
    key: 'updatedTime',
    width: 100,
    render(row) {
      return h(
        "i",
        {},
        moment(row.updatedTime).format("YYYY-MM-DD HH:mm:ss")
      );
    }
  },
];

export const postType = [
  {
    label:'失物贴',
    value:1
  },
  {
    label:'招领帖',
    value:2
  },
  {
    label:'其他帖',
    value:3
  },
  {
    label:'学习帖',
    value:4
  },
]
