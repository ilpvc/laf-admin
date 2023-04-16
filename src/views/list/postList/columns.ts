import { h } from 'vue';
import { NTag } from 'naive-ui';

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
    width: 80,
  },
  {
    title: '发帖人',
    key: 'userId',
    width: 50,
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.status === 1 ? 'success' : 'error',
        },
        row.status === 1 ? '正常' : '封禁'
      );
    },
    width: 100,
  },
  // {
  //   title: '地址',
  //   key: 'address',
  //   auth: ['basic_list'], // 同时根据权限控制是否显示
  //   ifShow: (_column) => {
  //     return true; // 根据业务控制是否显示
  //   },
  //   width: 150,
  // },
  {
    title: '创建时间',
    key: 'createdTime',
    width: 100,
  },

  {
    title: '更新日期',
    key: 'updatedTime',
    width: 100,
  },
];
