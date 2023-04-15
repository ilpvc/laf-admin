import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';

export const columns = [
  {
    title: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '头像',
    key: 'header',
    width: 100,
    render(row) {
      return h(NAvatar, {
        size: 48,
        src: row.header,
      });
    },
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 100,
  },
  {
    title: '真实姓名',
    key: 'realName',
    width: 100,
  },
  {
    title: '年龄',
    key: 'age',
    width: 50,
  },
  {
    title: '班级',
    key: 'clazz',
    width: 80,
  },
  {
    title: '性别',
    key: 'gender',
    width: 50,
  },
  {
    title: 'QQ',
    key: 'qq',
    width: 100,
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
